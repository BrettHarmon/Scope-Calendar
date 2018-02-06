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
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.web.util.UriComponentsBuilder;

import scopeCalendar.models.User;
import scopeCalendar.repos.UserRepository;


@Controller
public class UserController {
	
	@Autowired
	UserRepository userRepository;
	
	
	@PostMapping(value = {"/signup"}, produces = "application/json")
	public ResponseEntity<?> createAccount(@RequestParam(required = true) String password,
									@RequestParam(required = true) String email,
									@RequestParam(required = true) String username, UriComponentsBuilder ucb, 
									Model model)  {
		HttpHeaders headers = new HttpHeaders();
		headers.setLocation(ucb.path("/home").build().toUri());
		System.out.println(headers.getLocation().toString());
		User user = new User();
		user.setEmail(email);
		user.setPassword(password);
		user.setUsername(username);
		userRepository.save(user);


		return new ResponseEntity<User>(user, headers, HttpStatus.CREATED);
		
	}
	

}
