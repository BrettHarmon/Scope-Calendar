package scopeCalendar.models;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Set;

import javax.persistence.*;

import javax.validation.constraints.Pattern;
import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotEmpty;
import org.springframework.data.annotation.Transient;

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
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "userId")
	private long userId;
	
	@ManyToMany(targetEntity=Organization.class, cascade=CascadeType.ALL)
    @JoinTable(
          name="user_organization_junction",
          joinColumns=@JoinColumn(name="userId"),
          inverseJoinColumns=@JoinColumn(name="organizationId")
        )
	private Set<Organization> subscribedOrganizations;
	
	@Transient
	@OneToMany(mappedBy="owner")
    private Set<Organization> orgs;
    
	public Set<Organization> getOwnedOrganizations() {
		return orgs;
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
}