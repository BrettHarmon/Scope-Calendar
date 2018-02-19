package scopeCalendar.models;

import java.io.Serializable;
import java.util.ArrayList;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "organizations")
public class Organization implements Serializable {


	private static final long serialVersionUID = -5513950805803868005L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "organizationId")
	private long organizationId;
	
	
	@Column(name = "name")
	private String name;
	
	@Column(name = "ownerId")
	private long ownerId;
	
	@Column(name = "users")
	private ArrayList<User> users;

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

	public long getOwnerId() {
		return ownerId;
	}

	public void setOwnerId(long ownerId) {
		this.ownerId = ownerId;
	}

	public ArrayList<User> getUsers() {
		return users;
	}

	public void setUsers(ArrayList<User> users) {
		this.users = users;
	}

}
