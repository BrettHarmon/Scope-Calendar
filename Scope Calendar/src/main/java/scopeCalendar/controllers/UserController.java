package scopeCalendar.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import scopeCalendar.models.User;
import scopeCalendar.repos.UserRepository;


@Controller
public class UserController {
	
	@Autowired
	UserRepository userRepository;
	
	
	@PostMapping(value = {"/signup"}, produces = "application/json")
	public String createAccount(@RequestParam(required = true) String password,
									@RequestParam(required = true) String email,
									@RequestParam(required = true) String username, 
									Model model)  {

		return "index";
		
	}
	

}
