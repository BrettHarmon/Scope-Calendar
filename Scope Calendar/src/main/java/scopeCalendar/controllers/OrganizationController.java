package scopeCalendar.controllers;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;

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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.util.UriComponentsBuilder;

import scopeCalendar.models.CompoundModels.CreateEventCM;
import scopeCalendar.models.CompoundModels.CreateOrganizationCM;
import scopeCalendar.models.CompoundModels.OrganizationRespone;
import scopeCalendar.models.CompoundModels.SimpleId;
import scopeCalendar.models.Event;
import scopeCalendar.models.Organization;
import scopeCalendar.models.User;
import scopeCalendar.repos.EventRepository;
import scopeCalendar.repos.OrganizationRepository;
import scopeCalendar.repos.UserRepository;
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
	

	@PostMapping(value = {"create"}, produces = "application/json")
	@ResponseBody
	public ResponseEntity<?> createOrganization(@RequestBody CreateOrganizationCM userInput, UriComponentsBuilder ucb, 
									Model model) {
		String error = "";
		if (organizationRepository.findByName(userInput.getOrganization().getName()) != null) {
			error = "An Organization with that name already exists";
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
		}
		System.out.println(userInput.getOrganization().getDescription() + userInput.getOrganization().getName());
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		userInput.getOrganization().setOwner(user);
		// initialize the organization subbed users set
		userInput.getOrganization().setSubbedUsers(new HashSet<User>());
		userInput.getOrganization().setEvents(new HashSet<Event>());
		userInput.getOrganization().addSubscriber(user);
		
		//create dummy event for now
		Event event = new Event();
		event.setName("Example event");
		event.setDescription("This is just an example event. Soon you can add more!");
		DateTimeFormatter formatter = DateTimeFormat.forPattern("yyyy/MM/dd HH:mm:ss");
		DateTime startDate = formatter.parseDateTime("2018/03/09 01:00:00");
		DateTime endDate = formatter.parseDateTime("2018/03/09 05:00:00");
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
		DateTimeFormatter formatter = DateTimeFormat.forPattern("yyyy-MM-dd HH:mm:ss a");
		System.out.println(userInput.startDate);
		DateTime startDate = formatter.parseDateTime(userInput.startDate);
		DateTime endDate = formatter.parseDateTime(userInput.endDate);
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		// check if user is the owner (later change to has permission)
		Organization organization = organizationRepository.findOne(userInput.getOrganizationId());
		System.out.println(userInput.getOrganizationId());
		if (user == null) {
			System.out.println("heytherecowboy");
			
		}
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
	
	@GetMapping(value ={"subscribed"}, produces = "application/json")
	@ResponseBody
	public ResponseEntity<?> getSubscribedOrganizations() {
		//first get the user, then return their subscribed organizations set
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
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
		result.setIsPrivate(String.valueOf(org.getPrivate()));
		
		//find out if user is a subscriber to organization
		String username = SecurityContextHolder.getContext().getAuthentication().getName();
		User loggedIn = userRepository.findByUsernameIgnoreCase(username);
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
		
		String username = SecurityContextHolder.getContext().getAuthentication().getName();
		User loggedIn = userRepository.findByUsernameIgnoreCase(username);
		Organization org = organizationRepository.getOne(idObj.getId());
		
		if(loggedIn == null || org == null) {
			return new ResponseEntity<Object>("Error finding organization or user", HttpStatus.BAD_REQUEST);
		}
		boolean subbed = loggedIn.getSubscribedOrganizations().contains(org);
		
		HashMap<String, String> response = new HashMap<>();
		
		if(subbed) {
			org.removeSubscriber(loggedIn);
			response.put("subbed", "false");
		}
		else {
			org.addSubscriber(loggedIn);
			response.put("subbed", "true");
		}
		
		organizationRepository.save(org);
		return new ResponseEntity<Object>(response, HttpStatus.OK);
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
