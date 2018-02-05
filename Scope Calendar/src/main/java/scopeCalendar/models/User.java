package scopeCalendar.models;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotEmpty;
import org.springframework.data.annotation.Transient;

public class User implements Serializable {
	private static final long serialVersionUID = 3832260458606639106L;
	@Column(name = "password")
	@Length(min = 5, message = "*Your password must have at least 5 characters")
	@NotEmpty(message = "*Please provide your password")
	@Transient
	private String password;
	@Column(name = "email")
	@NotEmpty(message = "*Enter a email address")
	private String email;
	
	@Column(name = "username")
	@NotEmpty(message = "*Enter a username")
	private String username;

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "userid")
	private long userId;
	
	
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
}