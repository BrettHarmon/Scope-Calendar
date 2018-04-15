package scopeCalendar.repos;

import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;

import scopeCalendar.models.Organization;
import scopeCalendar.models.Tag;

public interface OrganizationRepository extends JpaRepository<Organization, Long> {
	Organization findByName(String one);
	Set<Organization> findByNameContainingIgnoreCase(String arg0);
	
	Set<Organization> findByTagsIn(Set<Tag> tags);
}
