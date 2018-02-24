package scopeCalendar.models;

import java.io.Serializable;
import java.util.Set;

import javax.persistence.*;

import org.hibernate.validator.constraints.NotEmpty;

@Entity
@Table(name = "organizations")
public class Organization implements Serializable {
	private static final long serialVersionUID = -5513950805803868005L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "organizationId")
	private long organizationId;
	
	@Column(name = "name")
	@NotEmpty(message = "*An organization must be called something.")
	private String name;
	
	@Column(columnDefinition="TEXT") //supports longer length DB entries
	private String description;
	
	@ManyToOne(optional = false)
	@JoinColumn(name="ownerId", nullable=false)
	private User owner;
	
	@ManyToMany(mappedBy = "subscribedOrganizations") //Junction table created on user.subscribedOrganizations 
	private Set<User> users;
	
	@OneToMany(mappedBy = "organization")
	private Set<Event> events;
	
	public long getOrganizationId() {
		return organizationId;
	}

	public void setOrganizationId(long organizationId) {
		this.organizationId = organizationId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public User getOwner() {
		return owner;
	}

	public void setOwner(User owner) {
		this.owner = owner;
	}

	public Set<User> getUsers() {
		return users;
	}

	public void setUsers(Set<User> users) {
		this.users = users;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Set<Event> getEvents() {
		return events;
	}

	public void setEvents(Set<Event> events) {
		this.events = events;
	}

}
