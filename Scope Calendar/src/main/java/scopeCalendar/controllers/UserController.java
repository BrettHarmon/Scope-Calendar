package scopeCalendar.controllers;


import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import scopeCalendar.models.CompoundModels.*;
import scopeCalendar.models.Event;
import scopeCalendar.models.Organization;
import scopeCalendar.models.User;
import scopeCalendar.repos.UserRepository;
import scopeCalendar.services.IUserService;


@Controller
public class UserController {
	
	@Autowired
	UserRepository userRepository;
	
	@Autowired
	private IUserService userService;
	
	@PostMapping(value = {"/signup"}, produces = "application/json")
	@ResponseBody
	public ResponseEntity<?> createAccount(@RequestBody @Valid CreateAccountCM userInput, BindingResult bindingResult, 
									Model model)  {
		
		HashMap<String, String> resp = new HashMap<>(); //Password errors are: generalError, usernameError, emailError, passwordError
		
		//Parse through errors directed from field annotations (requirements eg: notEmpty) 
		if (bindingResult.hasErrors()) {
			for( FieldError error : bindingResult.getFieldErrors()) {
				if(error.getField().equalsIgnoreCase( "user.username")) {
					resp.put("usernameError", error.getDefaultMessage());
				}
				else if(error.getField().equalsIgnoreCase( "user.email")) {
					resp.put("emailError", error.getDefaultMessage());
				}
				else if(error.getField().equalsIgnoreCase( "user.password")) {
					resp.put("passwordError", error.getDefaultMessage());
				}
			}
		}
		
		String error = "";
		
		// -- General errors
		if (userInput.getUser().getEmail().trim().isEmpty() || userInput.getUser().getPassword().trim().isEmpty()
				|| userInput.getUser().getUsername().trim().isEmpty() || userInput.getPassword2().isEmpty() ) {
			error = "Please fill in all the fields.";
			resp.put("generalError", error);
		}
		
		// -- Username errors
		if (userRepository.findByUsernameIgnoreCase(userInput.getUser().getUsername()) != null) {
			error = "Username already exists.";
			resp.put("usernameError", error);
		}
		
		
		// -- Email errors
		if (userRepository.findByEmailIgnoreCase(userInput.getUser().getEmail()) != null) {
			error = "E-mail already exists.";
			resp.put("emailError", error);
		}
		
		// -- Password Errors
		if(!userInput.password2.equals(userInput.getUser().getPassword())) {
			error = "Passwords don't match. Try again.";
			resp.put("passwordError", error);
		}
		
		if(!resp.isEmpty()) {
			return new  ResponseEntity<>(resp, HttpStatus.BAD_REQUEST); 
		}
		
		
		User user = new User();
		user.setEmail(userInput.getUser().getEmail().trim());
		user.setPassword(userInput.getUser().getPassword());
		user.setUsername(userInput.getUser().getUsername().trim());
		
		try {
			userService.createUser(user);
		}catch (Exception e) {
			error = "There was a problem creating your account. Please try again.";
			System.out.println(e);
			resp.put("generalError", error);
			return new  ResponseEntity<>(resp, HttpStatus.BAD_REQUEST); 
		}
		
		//Automatically log in user upon creation
		SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(
				user, null, new ArrayList<SimpleGrantedAuthority>(Arrays.asList(new SimpleGrantedAuthority("ROLE_USER")))));
		
		return ResponseEntity.status(HttpStatus.CREATED).body(user);
	}
	
	
	
	@PostMapping(value = {"/user/getevents"}, produces = "application/json")
	@ResponseBody
	public ResponseEntity<?> UserEventList(Model model) {
		String error = "";
		User user = userRepository.findByUsernameIgnoreCase(SecurityContextHolder.getContext().getAuthentication().getName());
		
		List<Organization> subbedOrgs = new LinkedList<Organization>(user.getSubscribedOrganizations());
		List<Set<Event>> subscribedEvents = new LinkedList<>();
		for(Organization org : subbedOrgs) {
			subscribedEvents.add(org.getEvents());
		}
		return ResponseEntity.status(HttpStatus.OK).body(subscribedEvents);
	}
	
	@GetMapping(value ={"/LoginAuth"}, produces = "application/json")
	@ResponseBody
	public Object UserInfo() {
		
		System.out.println("User info requested.");
		return SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		
		
	}
	
	@GetMapping({"/test"})
	@ResponseBody
	public ResponseEntity<?> test() {
		
		System.out.println("HELLO ANDROID");
		User user = new User();
		user.setEmail("email@email.com");
		return ResponseEntity.status(HttpStatus.CREATED).body(user);
		
		
	}
	

}
