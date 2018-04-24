package scopeCalendar.models;

import java.io.Serializable;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.persistence.*;

import javax.validation.constraints.Pattern;
import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotEmpty;
import org.springframework.data.annotation.Transient;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "users")
public class User implements Serializable {
	private static final long serialVersionUID = 3832260458606639106L;
	@Column(name = "password")
	@Length(min = 5, message = "*Your password must have at least 5 characters")
	@NotEmpty(message = "*Please provide a password")
	@Transient
	private String password;
	
	
	@Column(name = "email")
	@NotEmpty(message = "*Enter an email address.")
	@Email(message = "*Enter a valid email address.")
	private String email;
	
	@Column(name = "username")
	@Pattern(regexp = "^[a-zA-Z0-9-_]*$", message = "Usernames may only contain dashes \\\"-\\\", underscores \\\"_\\\", letters and numbers." )
	@NotEmpty(message = "*Enter a username")
	private String username;

	@Id
	@SequenceGenerator(initialValue=1000, 
						     allocationSize=1,
						     name = "identity_sequence", 
						     sequenceName="identity_sequence")
	@GeneratedValue(generator="identity_sequence")
	@Column(name = "userId")
	private long userId;
	
	@ManyToMany(mappedBy = "subbedUsers") //Junction table created on Organization.subbedUsers 
	@JsonIgnore
	private Set<Organization> subscribedOrganizations = new HashSet<>();
	
	@ManyToMany(mappedBy = "privateUsers") //Junction table created on Organization.subbedUsers 
	@JsonIgnore
	private Map<Organization, Boolean> privateOrganizations = new HashMap<Organization, Boolean>();
	

	@Transient
	@OneToMany(mappedBy="owner")
	@JsonIgnore
    private Set<Organization> orgs = new HashSet<>();
    
	public Set<Organization> getOwnedOrganizations() {
		return orgs;
	}

	public void setOrgs(Set<Organization> orgs) {
		this.orgs = orgs;
	}


	public User(){

	}
	
	public long getUserId() {
		return userId;
	}

	public void setUserId(long userId) {
		this.userId = userId;
	}

	
	public String getPassword(){
		return this.password;
	}
	
	public String getEmail(){
		return this.email;
	}
	
	public void setPassword(String pass){
		this.password = pass;
	}

	public void setEmail(String email){
			this.email = email;
	}
	
	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}
	
	public List<String> getRole() {
		return Arrays.asList("ROLE_USER");
	}

	public Set<Organization> getSubscribedOrganizations() {
		return subscribedOrganizations;
	}

	public void setSubscribedOrganizations(Set<Organization> subscribedOrganizations) {
		this.subscribedOrganizations = subscribedOrganizations;
	}
	
	public Map<Organization, Boolean> getPrivateOrganizations() {
		return privateOrganizations;
	}

	public void setPrivateOrganizations(Map<Organization, Boolean> privateOrganizations) {
		this.privateOrganizations = privateOrganizations;
	}

}