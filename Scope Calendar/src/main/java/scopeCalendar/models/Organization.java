package scopeCalendar.models;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.*;

import org.hibernate.validator.constraints.NotEmpty;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "organizations")
public class Organization implements Serializable {
	private static final long serialVersionUID = -5513950805803868005L;
	
	public Organization() {
		this.tags = new HashSet<Tag>();
	}
	
	@Id
	@SequenceGenerator(initialValue=1000, 
						    allocationSize=1,
						    name = "identity_sequence", 
						    sequenceName="identity_sequence")
	@GeneratedValue(generator="identity_sequence")
	@Column(name = "organizationId")
	private long organizationId;
	
	@Column(name = "name")
	@NotEmpty(message = "*An organization must be called something.")
	private String name;
	
	@Column(columnDefinition="TEXT") //supports longer length DB entries
	private String description;
	
	@ManyToOne(optional = false)
	@JoinColumn(name="ownerId", nullable=false)
	@JsonIgnore
	private User owner;
	
	@ManyToMany(targetEntity=User.class)
    @JoinTable(
          name="user_organization_junction",
    		  joinColumns=@JoinColumn(name="organizationId"),
    		  inverseJoinColumns=@JoinColumn(name="userId")
        )
	@JsonIgnore
	private Set<User> subbedUsers;
	
	@ManyToMany(targetEntity=Tag.class)
    @JoinTable(
          name="tag_organization_junction",
    		  joinColumns=@JoinColumn(name="organizationId"),
    		  inverseJoinColumns=@JoinColumn(name="tagId")
        )
	@JsonIgnore
	private Set<Tag> tags;
	
	public Set<Tag> getTags() {
		return tags;
	}

	public void setTags(Set<Tag> tags) {
		this.tags = tags;
	}

	@OneToMany(mappedBy = "organization")
	@JsonIgnore
	private Set<Event> events;
	
	@Column(name = "private")
	private boolean isPrivate = false; 
	
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

	public Set<User> getSubbedUsers() {
		return subbedUsers;
	}

	public void setSubbedUsers(Set<User> users) {
		this.subbedUsers = users;
	}
	public void addSubscriber(User user) {
		subbedUsers.add(user);
	}
	public void removeSubscriber(User user) {
		subbedUsers.remove(user);
	}
	
	public void addTag(Tag tag) {
		tags.add(tag);
	}
	public void removeTag(Tag tag) {
		tags.remove(tag);
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
	
	public void setPrivate(boolean isPrivate)
	{
		this.isPrivate = isPrivate;
	}

	public boolean getPrivate()
	{
		return isPrivate;
	}
	
}
