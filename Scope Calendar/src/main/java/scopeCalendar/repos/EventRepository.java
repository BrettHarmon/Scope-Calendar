package scopeCalendar.repos;

import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;

import scopeCalendar.models.Event;


public interface EventRepository extends JpaRepository<Event, Long> {
	Set<Event> findByOrganization(Long arg0);
}
