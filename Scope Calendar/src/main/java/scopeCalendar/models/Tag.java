package scopeCalendar.models;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "tags")
public class Tag implements Serializable {
	
	public Tag() {
		this.organizations = new HashSet<Organization>();
	}
	
	public Tag(String name) {
		this.name = name;
		this.organizations = new HashSet<Organization>();
	}

	private static final long serialVersionUID = 4495888982688313797L;

	@ManyToMany(mappedBy = "tags") //Junction table created on Organization.subbedUsers 
	@JsonIgnore
	private Set<Organization> organizations;
	
    @Column(name = "name")
    private String name;
    
    @Id
    @SequenceGenerator(initialValue=1000, 
						    allocationSize=1,
						    name = "identity_sequence", 
						    sequenceName="identity_sequence")
    @GeneratedValue(generator="identity_sequence")
    @Column(name = "tagId")
    private long tagId;

	public Set<Organization> getOrganizations() {
		return organizations;
	}

	public void setOrganizations(Set<Organization> organizations) {
		this.organizations = organizations;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public long getTagId() {
		return tagId;
	}

	public void setTagId(long tagId) {
		this.tagId = tagId;
	}

}
