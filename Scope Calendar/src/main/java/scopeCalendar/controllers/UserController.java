package scopeCalendar.controllers;


import java.net.URI;
import java.util.HashMap;

import org.hibernate.validator.internal.constraintvalidators.hv.EmailValidator;
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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.web.util.UriComponentsBuilder;

import scopeCalendar.models.CompoundModels.*;
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
		
		// -- General errors
		if (userInput.getUser().getEmail().trim().isEmpty() || userInput.getUser().getPassword().trim().isEmpty()
				|| userInput.getUser().getUsername().trim().isEmpty() || userInput.getPassword2().isEmpty() ) {
			error = "Please fill in all the fields.";
			HashMap<String, String> resp = new HashMap<>();
			resp.put("generalError", error);
			return new  ResponseEntity<>(resp, HttpStatus.BAD_REQUEST); 
		}
		
		// -- Username errors
		String username = null;
		if (userRepository.findByUsernameIgnoreCase(username = userInput.getUser().getUsername()) != null) {
			error = "Username already exists.";
			HashMap<String, String> resp = new HashMap<>();
			resp.put("usernameError", error);
			return new  ResponseEntity<>(resp, HttpStatus.BAD_REQUEST); 
		}
		//Check username matches username rules
		if(username.matches("^.*[^a-zA-Z0-9-_].*$")) {
			error = "Usernames may only contain dashes \"-\", underscores \"_\", letters and numbers.";
			HashMap<String, String> resp = new HashMap<>();
			resp.put("usernameError", error);
			return new  ResponseEntity<>(resp, HttpStatus.BAD_REQUEST); 
		}
		
		// -- Email errors
		String email = null;
		if (userRepository.findByEmailIgnoreCase(email = userInput.getUser().getEmail()) != null) {
			error = "E-mail already exists.";
			HashMap<String, String> resp = new HashMap<>();
			resp.put("emailError", error);
			return new  ResponseEntity<>(resp, HttpStatus.BAD_REQUEST); 
		}
		EmailValidator em = new EmailValidator();
		if(!em.isValid(email, null ) ) {
			error = "Enter valid e-mail address.";
			HashMap<String, String> resp = new HashMap<>();
			resp.put("emailError", error);
			return new  ResponseEntity<>(resp, HttpStatus.BAD_REQUEST); 
		}

		// -- Password Errors
		if(!userInput.password2.equals(userInput.getUser().getPassword())) {
			error = "Passwords don't match. Try again.";
			HashMap<String, String> resp = new HashMap<>();
			resp.put("passwordError", error);
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
			HashMap<String, String> resp = new HashMap<>();
			resp.put("generalError", error);
			return new  ResponseEntity<>(resp, HttpStatus.BAD_REQUEST); 
		}
		
		return ResponseEntity.status(HttpStatus.CREATED).body(user);
	}
	
	@RequestMapping(value = {"/login"}, method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<?> Login( UriComponentsBuilder ucb, 
									Model model)  {
		String s = "Dopeeee";
		HashMap<String, String> resp = new HashMap<>();
		//resp.put(user, pass);
		//return new  ResponseEntity<>(resp, HttpStatus.OK); 
	
		return ResponseEntity.status(HttpStatus.CREATED).body(s);
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
