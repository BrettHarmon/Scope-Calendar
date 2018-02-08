package scopeCalendar.controllers;


import java.net.URI;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.web.util.UriComponentsBuilder;

import scopeCalendar.models.User;
import scopeCalendar.repos.UserRepository;
import scopeCalendar.services.UserService;


@Controller
public class UserController {
	
	@Autowired
	UserRepository userRepository;
	
	@Autowired
	private UserService userService;
	
	
	@PostMapping(value = {"/signup"}, produces = "application/json")
	public ResponseEntity<?> createAccount(@RequestBody User userInput, UriComponentsBuilder ucb, 
									Model model)  {
		HttpHeaders headers = new HttpHeaders();
		headers.setLocation(ucb.path("/home").build().toUri());
		System.out.println(headers.getLocation().toString());
		User user = new User();
		user.setEmail(userInput.getEmail());
		user.setPassword(userInput.getPassword());
		user.setUsername(userInput.getUsername());
		userService.createUser(user);


		return new ResponseEntity<User>(user, headers, HttpStatus.CREATED);
		
	}
	
	@GetMapping({"/test"})
	@ResponseBody
	public User test() {
		
		System.out.println("HELLO ANDROID");
		User user = new User();
		user.setEmail("email@email.com");
		return user;
		
		
	}
	

}
