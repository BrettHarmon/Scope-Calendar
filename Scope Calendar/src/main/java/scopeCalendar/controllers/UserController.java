package scopeCalendar.controllers;


import java.net.URI;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jackson.JsonObjectSerializer;
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

import scopeCalendar.models.CompoundModels.CreateAccountCM;
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
	public ResponseEntity<?> createAccount(@RequestBody CreateAccountCM userInput, UriComponentsBuilder ucb, 
									Model model)  {
		
		String error = "";
		
		if (userInput.getUser().getEmail().trim().isEmpty() || userInput.getUser().getPassword().trim().isEmpty()
				|| userInput.getUser().getUsername().trim().isEmpty() || userInput.getPassword2().isEmpty() ) {
			error = "Please fill in all the fields.";
			HashMap<String, String> resp = new HashMap<>();
			resp.put("generalError", error);
			return new  ResponseEntity<>(resp, HttpStatus.BAD_REQUEST); 
		}
		
		if(!userInput.password2.equals(userInput.getUser().getPassword())) {
			error = "Passwords don't match. Try again.";
			HashMap<String, String> resp = new HashMap<>();
			resp.put("passwordError", error);
			return new  ResponseEntity<>(resp, HttpStatus.BAD_REQUEST); 
		}
		
		if (userRepository.findByEmailIgnoreCase(userInput.getUser().getEmail()) != null) {
			error = "Email already exists.";
			HashMap<String, String> resp = new HashMap<>();
			resp.put("emailError", error);
			return new  ResponseEntity<>(resp, HttpStatus.BAD_REQUEST); 
		}
		String username = null;
		if (userRepository.findByUsernameIgnoreCase(username = userInput.getUser().getUsername()) != null) {
			error = "Username already exists.";
			HashMap<String, String> resp = new HashMap<>();
			resp.put("usernameError", error);
			return new  ResponseEntity<>(resp, HttpStatus.BAD_REQUEST); 
		}
		//Check if any nonAlphanumeric characters exist
		if(username.matches("^.*[^a-zA-Z0-9 ].*$")) {
			error = "Usernames may only contain letters, numbers and spaces.";
			HashMap<String, String> resp = new HashMap<>();
			resp.put("usernameError", error);
			return new  ResponseEntity<>(resp, HttpStatus.BAD_REQUEST); 
		}
		
		User user = new User();
		user.setEmail(userInput.getUser().getEmail().trim());
		user.setPassword(userInput.getUser().getPassword().trim());
		user.setUsername(userInput.getUser().getUsername().trim());
		
		try {
			userService.createUser(user);
		}catch (Exception e) {
			error = "There was a problem creating your account. Please try again.";
			System.out.println(e);
			HashMap<String, String> resp = new HashMap<>();
			resp.put("generalError", error);
			return new  ResponseEntity<>(resp, HttpStatus.BAD_REQUEST); 
		}
		
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
