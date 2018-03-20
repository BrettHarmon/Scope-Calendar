package scopeCalendar.repos;

import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;


import scopeCalendar.models.Organization;

public interface OrganizationRepository extends JpaRepository<Organization, Long> {
	Organization findByName(String one);
	//Set<Organization> findByName(String arg0);
}
