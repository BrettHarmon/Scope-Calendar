package scopeCalendar.repos;

import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;

import scopeCalendar.models.Tag;


public interface TagRepository extends JpaRepository<Tag, Long> {

	Set<Tag> findDistinctByNameIn(List<String> name);
	Tag findByName(String name);
	
}
