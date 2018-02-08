package scopeCalendar.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import scopeCalendar.models.User;
import scopeCalendar.repos.UserRepository;



@Service("userService")
public class UserServiceImpl implements UserService {
	@Autowired
	private UserRepository userRepository;
	@Autowired
	private PasswordEncoder bCryptPasswordEncoder;
	@Override
	public void createUser(User user) {
		
		user.setPassword(this.bCryptPasswordEncoder.encode(user.getPassword()));
		this.userRepository.save(user);
	}
	

}
