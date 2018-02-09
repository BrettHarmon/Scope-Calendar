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
		
		String error = "";
		
		if (userInput.getEmail().isEmpty() || userInput.getPassword().isEmpty()
				|| userInput.getUsername().isEmpty() ) {
			error = "Please fill in all the fields";
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
		}
		
		if (userRepository.findByEmail(userInput.getEmail()) != null) {
			error = "Email already exists";
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
		}
		if (userRepository.findByUsername(userInput.getUsername()) != null) {
			error = "Username already exists";
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
		}
		
		User user = new User();
		user.setEmail(userInput.getEmail());
		user.setPassword(userInput.getPassword());
		user.setUsername(userInput.getUsername());
		userService.createUser(user);
		

		return ResponseEntity.status(HttpStatus.CREATED).body(user);
		
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
