package scopeCalendar.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.util.UriComponentsBuilder;

import scopeCalendar.models.Organization;
import scopeCalendar.repos.OrganizationRepository;
import scopeCalendar.repos.UserRepository;

@Controller
public class OrganizationController {
	
	@Autowired
	UserRepository userRepository;
	
	@Autowired
	OrganizationRepository organizationRepository;
	

	@PostMapping(value = {"/organization/create"}, produces = "application/json")
	@ResponseBody
	public ResponseEntity<?> createOrganization(@RequestBody Organization userInput, UriComponentsBuilder ucb, 
									Model model) {
		String error = "";
		if (organizationRepository.findByName(userInput.getName()) != null) {
			error = "An Organization with that name already exists";
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
		}
		
		organizationRepository.save(userInput);
		
		return ResponseEntity.status(HttpStatus.CREATED).body(userInput);
		
		
	}
}
