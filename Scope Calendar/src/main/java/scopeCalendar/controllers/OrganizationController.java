package scopeCalendar.controllers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;

import javax.validation.Valid;

import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.util.UriComponentsBuilder;

import scopeCalendar.models.CompoundModels.*;
import scopeCalendar.models.Event;
import scopeCalendar.models.Organization;
import scopeCalendar.models.Tag;
import scopeCalendar.models.User;
import scopeCalendar.repos.*;
import scopeCalendar.services.EventTimeComparer;

@Controller
@RequestMapping("/organization/*")
public class OrganizationController {
	
	@Autowired
	UserRepository userRepository;
	
	@Autowired
	OrganizationRepository organizationRepository;
	
	@Autowired
	EventRepository eventRepository;
	
	@Autowired
	TagRepository tagRepository;
	
	//Get logged in user helper
	private User getUser() {
		Authentication UserAuth = SecurityContextHolder.getContext().getAuthentication();
		String username = null;
		if(UserAuth.getPrincipal() instanceof User) {
			username = ((User) UserAuth.getPrincipal()).getUsername();
		}else if(UserAuth.getPrincipal() instanceof org.springframework.security.core.userdetails.User) {
			username = ((org.springframework.security.core.userdetails.User) UserAuth.getPrincipal()).getUsername();
		}
		return userRepository.findByUsernameIgnoreCaseOrEmailIgnoreCase(username, username);
	}
	

	@PostMapping(value = {"create"}, produces = "application/json")
	@ResponseBody
	public ResponseEntity<?> createOrganization(@RequestBody CreateOrganizationCM userInput, UriComponentsBuilder ucb, 
									Model model) {
		String error = "";
		if (organizationRepository.findByName(userInput.getOrganization().getName()) != null) {
			error = "An Organization with that name already exists";
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
		}
		System.out.println(userInput.getOrganization().isPrivate());
		User user = getUser();
		userInput.getOrganization().setOwner(user);
		// initialize the organization subbed users set
		userInput.getOrganization().setSubbedUsers(new HashSet<User>());
		userInput.getOrganization().setEvents(new HashSet<Event>());
		userInput.getOrganization().addSubscriber(user);
		System.out.println("" + userInput.getIsPrivate());
		
		//read private string
		if (userInput.isPrivate.equals("true")) {
			userInput.getOrganization().setPrivate(true);
			userInput.getOrganization().sendInvite(user);
		} else {
			userInput.getOrganization().setPrivate(false);
		}
		
		//add owner to private list if organization is private
		
		//this is tag creation
		for (String tagName: userInput.getTags()) {
			Tag tag = tagRepository.findByName(tagName);
			if (tag == null) {
				tag = new Tag(tagName);
				tagRepository.save(tag);
			}
			userInput.getOrganization().addTag(tag);
		}
		
		//create dummy event for now
		Event event = new Event();
		event.setName("Example event");
		event.setDescription("This is just an example event. Soon you can add more!");
		DateTimeFormatter formatter = DateTimeFormat.forPattern("yyyy/MM/dd HH:mm:ss");
		DateTime startDate = formatter.parseDateTime("2018/05/28 01:00:00");
		DateTime endDate = formatter.parseDateTime("2018/05/28 05:00:00");
		event.setStartDate(startDate);
		event.setEndDate(endDate);
		event.setTimezoneOffset();
		// you have to call save twice, once to give the organization and Id, and again to save the event
		organizationRepository.save(userInput.getOrganization());
		Organization organization = organizationRepository.findByName(userInput.getOrganization().getName());
		event.setOrganization(organization);
		organization.getEvents().add(event);
		organizationRepository.save(organization);
		eventRepository.save(event);
		
		
		// create the set in user if it is null
		if (user.getOwnedOrganizations() == null) {
			user.setOrgs(new HashSet<Organization>());
		}
		if (user.getSubscribedOrganizations() == null) {
			user.setSubscribedOrganizations(new HashSet<Organization>());
		}

		user.getSubscribedOrganizations().add(userInput.getOrganization());
		user.getOwnedOrganizations().add(userInput.getOrganization());
	    userRepository.save(user);
	   
		
		return ResponseEntity.status(HttpStatus.CREATED).body(organization);
		
		
	}
	
	@PostMapping(value = {"event/create"}, produces = "application/json")
	@ResponseBody
	public ResponseEntity<?> createEvent(@RequestBody CreateEventCM userInput, UriComponentsBuilder ucb, 
									Model model) {
		String error = "";
		// Date time conversion
		DateTimeFormatter formatter = DateTimeFormat.forPattern("yyyy-MM-dd h:mm a");
		System.out.println(userInput.startDate);
		DateTime startDate = formatter.parseDateTime(userInput.startDate);
		DateTime endDate = formatter.parseDateTime(userInput.endDate);
		User user = getUser();
		// check if user is the owner (later change to has permission)
		Organization organization = organizationRepository.findOne(userInput.getOrganizationId());
		System.out.println(userInput.getOrganizationId());
		if (organization.getOwner().getUserId() != user.getUserId()) {
			error = "You do not have permission to do that";
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
		}
		//set fields then save
		userInput.getEvent().setEndDate(endDate);
		userInput.getEvent().setStartDate(startDate);
		userInput.getEvent().setTimezoneOffset();
		//saving an organization has to happen first for some reason
		//if there are no events in an organization previously, initialize the set, then add the event and save
		if (organization.getEvents() == null) {
		organization.setEvents(new HashSet<Event>());
		}
		organization.getEvents().add(userInput.getEvent());
		organizationRepository.save(organization);
		userInput.getEvent().setOrganization(organizationRepository.findByName(organization.getName()));
		eventRepository.save(userInput.getEvent());
		

		
		
		return ResponseEntity.status(HttpStatus.CREATED).body(userInput.getEvent());
		
		
	}
	
	@PostMapping(value = {"event/modify"}, produces = "application/json")
	@ResponseBody
	public ResponseEntity<?> ModifyEvent(@RequestBody @Valid ModifyEventCM evt,BindingResult bindingResult, Model model) {
		
		List<String> errors = new ArrayList<>();
		
		//Parse through errors directed from field annotations (requirements eg: notEmpty) 
		if (bindingResult.hasErrors()) {
			for( FieldError error : bindingResult.getFieldErrors()) {
				errors.add(error.getDefaultMessage());
			}
		}
		if(evt.getEvent().getStartDate().isAfter(evt.getEvent().getEndDate())) {
			errors.add("A start time must come before the end time.");
		}
		if(!errors.isEmpty()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
		}
		
		Event edittedEvent = eventRepository.findOne(evt.event.getEventId());
		if (edittedEvent == null) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(false);
		}
		if(evt.event.getName() != null && !evt.event.getName().isEmpty()) {
			edittedEvent.setName(evt.event.getName());
		}
		edittedEvent.setDescription(evt.event.getDescription());
		edittedEvent.setStartDate(evt.event.getStartDate());
		edittedEvent.setEndDate(evt.event.getEndDate());
		edittedEvent.setTimezoneOffset(); //find Time zone offset from dates set
		
		eventRepository.save(edittedEvent);
		return ResponseEntity.status(HttpStatus.OK).body(true);
		
		
	}
	
	@PostMapping(value = {"event/delete"}, produces = "application/json")
	@ResponseBody
	public ResponseEntity<?> DeleteEvent(@RequestBody SimpleId eventId, UriComponentsBuilder ucb, 
									Model model) {
		if (eventId.getId() == 0) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(false);
		}
		eventRepository.delete(eventId.getId());
		return ResponseEntity.status(HttpStatus.OK).body(true);
	}
	
@GetMapping({"/searchByName/{searchBox}"})
	public ResponseEntity<?> searchOrganizationsByName(@PathVariable String searchBox) {
		
		Set<Organization> organizations = new HashSet<Organization>(); 
		if (!searchBox.isEmpty()) {
		 organizations = organizationRepository.findByNameContainingIgnoreCase(searchBox);
		}
		else { 
			return ResponseEntity.status(HttpStatus.OK).body("There are no matching results");
		}
		return ResponseEntity.status(HttpStatus.OK).body(organizations);
	}

@GetMapping({"/searchByTags/{searchBox}"})
public ResponseEntity<?> searchOrganizationsbyTags(@PathVariable String[] searchBox) {
	
	Set<Organization> organizations = new HashSet<Organization>(); 
	if (searchBox.length > 0) {
	 Set<Tag> tags = tagRepository.findDistinctByNameIn(searchBox);
	 
	 if (tags.isEmpty()) {
		 return ResponseEntity.status(HttpStatus.OK).body("There are no matching results");
	 }
	 
	 organizations = organizationRepository.findByTagsIn(tags);
	 
	 
	 return ResponseEntity.status(HttpStatus.OK).body(organizations);
	 
	}
	else { 
		return ResponseEntity.status(HttpStatus.OK).body("There are no matching results");
	}
	
}

@GetMapping({"/tags"})
public ResponseEntity<?> getTags() {
	
	List<String> tags = new ArrayList<String>();
	for (Tag tag : tagRepository.findAll()) {
		tags.add(tag.getName());
	}
	return ResponseEntity.status(HttpStatus.OK).body(tags);
}
	
	@GetMapping(value ={"subscribed"}, produces = "application/json")
	@ResponseBody
	public ResponseEntity<?> getSubscribedOrganizations() {
		//first get the user, then return their subscribed organizations set
		User user = getUser();
		System.out.println("Subbed organizations requested");
		List<Organization> subbed = new ArrayList<Organization>();
		if (user.getSubscribedOrganizations() == null)
		{
			return ResponseEntity.status(HttpStatus.OK).body(subbed);
		}
		
		subbed.addAll(user.getSubscribedOrganizations());
		for (int i = 0; i < subbed.size(); i++) {
			System.out.println(subbed.get(i).getName());
		}
		return ResponseEntity.status(HttpStatus.OK).body(subbed);
		
		
		
	}
	
	@PostMapping(value = {"info"}, consumes = "application/json", produces = "application/json")
	@ResponseBody
	public ResponseEntity<?> OrganizationProfile(@RequestBody SimpleId idObj, UriComponentsBuilder ucb, 
									Model model) {
		
		Organization org = organizationRepository.getOne(idObj.getId());
		OrganizationRespone result = new OrganizationRespone();
		result.setName(org.getName());
		result.setDescription(org.getDescription());
		result.setSubscribers(String.valueOf(org.getSubbedUsers().size()));
		result.setIsPrivate(String.valueOf(org.isPrivate()));
		
		//find out if user is a subscriber to organization
		User loggedIn = getUser();
		result.setIsSubscribed( String.valueOf(org.getSubbedUsers().contains(loggedIn)));
		result.setIsAdmin(String.valueOf(org.getOwner().equals(loggedIn)));
		
		
		List<Event> evts = new LinkedList<> (org.getEvents());
		evts.sort(new EventTimeComparer());
		//remove events before 'today'
		List<Event> tobeRemoved  = new LinkedList<Event>();
		for(Event e : evts) {
			if (e.getStartDate().isBeforeNow() ) {
				tobeRemoved.add(e);
			}
		}
		evts.removeAll(tobeRemoved);
		
		result.setEvents(evts);
		return new ResponseEntity<Object>(result, HttpStatus.OK);
	}
	
	//A means to 'toggle' a subscription on or off
	@PostMapping(value = {"subscription"}, consumes = "application/json", produces = "application/json")
	@ResponseBody
	public ResponseEntity<?> ToggleSubscription(@RequestBody SimpleId idObj, UriComponentsBuilder ucb, 
									Model model) {
		
		User user = getUser();
		Organization org = organizationRepository.getOne(idObj.getId());
		
		if(user == null || org == null) {
			System.out.println("The problem is here");
			if (user == null) {
				System.out.println("yeah loggedin is null");
			}
			if (org == null) {
				System.out.println("yeah org is null");
			}
			return new ResponseEntity<Object>("Error finding organization or user", HttpStatus.BAD_REQUEST);
		}
		boolean subbed = user.getSubscribedOrganizations().contains(org);
		
		HashMap<String, String> response = new HashMap<>();
		
		if(subbed) {
			org.removeSubscriber(user);
			response.put("subbed", "false");
		}
		else {
			org.addSubscriber(user);
			response.put("subbed", "true");
		}
		
		organizationRepository.save(org);
		return new ResponseEntity<Object>(response, HttpStatus.OK);
	}
	
	@PostMapping(value = {"requestInvitation"}, consumes = "application/json", produces = "application/json")
	@ResponseBody
	public ResponseEntity<?> requestPrivateInvitation(@RequestBody SimpleId idObj, UriComponentsBuilder ucb, 
									Model model) {
		
		User user = getUser();
		Organization org = organizationRepository.getOne(idObj.getId());
		
		if(user == null || org == null) {
			return new ResponseEntity<Object>("Error finding organization or user", HttpStatus.BAD_REQUEST);
		}
		
		if (org.getPrivateUsers().containsKey(user)) {
			return new ResponseEntity<Object>("You have already requested an invitation to this Organization", HttpStatus.BAD_REQUEST);
		}
		
		org.requestInvite(user);
		organizationRepository.save(org);
		return new ResponseEntity<Object>("You have requested an invitation to this Organization", HttpStatus.OK);
	}
	
	@PostMapping(value = {"sendInvitation"}, consumes = "application/json", produces = "application/json")
	@ResponseBody
	public ResponseEntity<?> sendPrivateInvitation(@RequestBody SimpleId idObj, UriComponentsBuilder ucb, 
									Model model) {
		
		User user = getUser();
		Organization org = organizationRepository.getOne(idObj.getId());
		
		if(user == null || org == null) {
			return new ResponseEntity<Object>("Error finding organization or user", HttpStatus.BAD_REQUEST);
		}
		
		if (org.getPrivateUsers().containsKey(user)) {
			return new ResponseEntity<Object>("This user is already on the invite list", HttpStatus.BAD_REQUEST);
		}
		
		org.sendInvite(user);
		organizationRepository.save(org);
		return new ResponseEntity<Object>("You have sent an invitation to the user", HttpStatus.OK);
	}
	
	@PostMapping(value = {"acceptInvitation"}, consumes = "application/json", produces = "application/json")
	@ResponseBody
	public ResponseEntity<?> acceptPrivateInvitation(@RequestBody SimpleId idObj, UriComponentsBuilder ucb, 
									Model model) {
		
		User user = getUser();
		Organization org = organizationRepository.getOne(idObj.getId());
		
		if(user == null || org == null) {
			return new ResponseEntity<Object>("Error finding organization or user", HttpStatus.BAD_REQUEST);
		}
		
		if (org.getOwner() != user) {
			return new ResponseEntity<Object>("You are not the owner of this organization", HttpStatus.BAD_REQUEST);
		}
		
		org.acceptInvite(user);
		organizationRepository.save(org);
		return new ResponseEntity<Object>("You have accepted this user to the organization", HttpStatus.OK);
	}
	
	@PostMapping(value = {"declineInvitation"}, consumes = "application/json", produces = "application/json")
	@ResponseBody
	public ResponseEntity<?> declinePrivateInvitation(@RequestBody SimpleId idObj, UriComponentsBuilder ucb, 
									Model model) {
		
		User user = getUser();
		Organization org = organizationRepository.getOne(idObj.getId());
		
		if(user == null || org == null) {
			return new ResponseEntity<Object>("Error finding organization or user", HttpStatus.BAD_REQUEST);
		}
		
		if (org.getOwner() != user) {
			return new ResponseEntity<Object>("You are not the owner of this organization", HttpStatus.BAD_REQUEST);
		}
		
		org.declineInvite(user);
		organizationRepository.save(org);
		return new ResponseEntity<Object>("You have denied this user access to the organization", HttpStatus.OK);
	}
	
	@GetMapping({"/privateUser/{organizationId}"})
	public ResponseEntity<?> privateUser(@PathVariable Long organizationId) {
		
		Organization organization = organizationRepository.findOne(organizationId);
		User user = getUser();
		System.out.println("HELLO     " + organization.getPrivateUsers().get(user));
		HashMap<String, String> response = new HashMap<>();
		if (organization.getPrivateUsers().containsKey(user)) {
			if (organization.getPrivateUsers().get(user)) {
				response.put("allowed", "true");
				return new ResponseEntity<Object>(response, HttpStatus.OK);
			} else {
				response.put("allowed", "false");
				return new ResponseEntity<Object>(response, HttpStatus.OK);
			}
		}
		response.put("allowed", "invite");
		return new ResponseEntity<Object>(response, HttpStatus.OK);
	}
	
	
	
	// Method responsible for modifying organization's description
	@PostMapping(value = {"updateDescription"}, consumes = "application/json", produces = "application/json")
	@ResponseBody
	public ResponseEntity<?> UpdateDescription(@RequestBody IDStringPair params, UriComponentsBuilder ucb, 
									Model model) {
		
		// Check to ensure the modifying user organization modifying privileges 
		User loggedIn = getUser();
		//Get organization by ID
		if(params.getId() < 1) {
			return new ResponseEntity<Object>("Invalid organization ID", HttpStatus.BAD_REQUEST);
		}
		Organization org = organizationRepository.getOne(params.getId());
		
		// Make sure both are valid in DB
		if(loggedIn == null || org == null) {
			return new ResponseEntity<Object>("Error finding organization or user", HttpStatus.BAD_REQUEST);
		}
		if(!org.getOwner().equals(loggedIn)) {
			return new ResponseEntity<Object>("User does not have authority to modify this organization", HttpStatus.BAD_REQUEST);
		}
		
		// Check to see if description is actually changing (this is handled on app but best to be sure)
		if(org.getDescription() == params.getText()) {
			return new ResponseEntity<Object>("No change in the description", HttpStatus.OK);
		}
		
		org.setDescription(params.getText());
		organizationRepository.save(org);
		return new ResponseEntity<Object>(true, HttpStatus.OK);
	}
	
	
	
	
	@RequestMapping( value = {"test"}, method ={RequestMethod.GET, RequestMethod.POST} )
	public ResponseEntity<?>  organizationTest() {
		long orgId = 1;
		Set<Event> evts = null;
		Organization org = organizationRepository.getOne(orgId);
		evts = org.getEvents();
		User user = org.getOwner();
		System.out.println(evts +""+ user);
		return ResponseEntity.status(HttpStatus.OK).body("");
		

	}
}
