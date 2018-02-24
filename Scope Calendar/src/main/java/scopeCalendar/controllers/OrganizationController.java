package scopeCalendar.controllers;

import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.util.UriComponentsBuilder;

import scopeCalendar.models.CompoundModels.CreateOrganizationCM;
import scopeCalendar.models.Event;
import scopeCalendar.models.Organization;
import scopeCalendar.models.User;
import scopeCalendar.repos.OrganizationRepository;
import scopeCalendar.repos.UserRepository;

@Controller
@RequestMapping("/organization/*")
public class OrganizationController {
	
	@Autowired
	UserRepository userRepository;
	
	@Autowired
	OrganizationRepository organizationRepository;
	

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
		organizationRepository.save(userInput.getOrganization());
		
		return ResponseEntity.status(HttpStatus.CREATED).body(userInput);
		
		
	}
	
	@PostMapping(value = {"info"}, produces = "application/json")
	@ResponseBody
	public ResponseEntity<?> OrganizationProfile(@RequestBody long OrganizationId, UriComponentsBuilder ucb, 
									Model model) {
		//String error = "";
		Organization org = organizationRepository.getOne(OrganizationId);

		//TODO: compile upcomingEvents object
		return ResponseEntity.status(HttpStatus.OK).body(org);
		
		
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
