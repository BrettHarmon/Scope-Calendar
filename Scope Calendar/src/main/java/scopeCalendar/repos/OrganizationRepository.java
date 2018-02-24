package scopeCalendar.repos;

import org.springframework.data.jpa.repository.JpaRepository;

import scopeCalendar.models.Organization;

public interface OrganizationRepository extends JpaRepository<Organization, Long> {
	Organization findByName(String one);
}
