package scopeCalendar.repos;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import scopeCalendar.models.User;


public interface UserRepository extends JpaRepository<User, Long> {
	User findByEmail(String arg0);
	User findByUsername(String arg0);
}
