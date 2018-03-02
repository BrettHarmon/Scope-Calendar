package scopeCalendar.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

import scopeCalendar.models.User;


public interface UserRepository extends JpaRepository<User, Long> {
	User findByEmailIgnoreCase(String arg0);
	User findByUsernameIgnoreCase(String arg0);
	User findByUsernameIgnoreCaseOrEmailIgnoreCase(String arg0, String arg1);
}
