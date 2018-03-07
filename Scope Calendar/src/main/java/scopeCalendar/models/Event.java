package scopeCalendar.models;

import java.io.Serializable;
import java.util.concurrent.TimeUnit;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import org.hibernate.annotations.Type;
import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;
import org.joda.time.Interval;

import com.fasterxml.jackson.annotation.JsonIgnore;


@Entity
@Table(name = "events")
public class Event implements Serializable {

    private static final long serialVersionUID = 3257654234123443123L;

    @Id
    @SequenceGenerator(initialValue=1000, 
						    allocationSize=1,
						    name = "identity_sequence", 
						    sequenceName="identity_sequence")
    @GeneratedValue(generator="identity_sequence")
    @Column(name = "eventId")
    private long eventId;

    @Column(name = "name")
    private String name;

    @Column(name = "description", columnDefinition="TEXT")
    private String description;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="organizationId", nullable=false)
    @JsonIgnore
    private Organization organization;

    @Column(name = "startDate")
    @Type(type="org.jadira.usertype.dateandtime.joda.PersistentDateTime")
    private DateTime start;

    @Column(name = "endDate")
    @Type(type="org.jadira.usertype.dateandtime.joda.PersistentDateTime")
    private DateTime end;
    
    @Column(name = "TimeZoneOffset")
    private int timezoneOffset;
    
    public Event() {
    	setTimezoneOffset();
    }
    

    public long getEventId() {
        return eventId;
    }

    public void setEventId(long eventId) {
        this.eventId = eventId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Organization getOrganization() {
        return organization;
    }

    public void setOrganization(Organization org) {
        this.organization = org;
    }

    public DateTime getStartDate() {
        return start;
    }

    public void setStartDate(DateTime startDate) {
        this.start = startDate;
    }

    public DateTime getEndDate() {
        return end;
    }

    public void setEndDate(DateTime endDate) {
        this.end = endDate;
    }
    public Interval getTimeInterval() {
    	return new Interval(start,end);
    }

	public int getTimezoneOffset() {
		return timezoneOffset;
	}

	public void setTimezoneOffset(int timezoneOffset) {
		this.timezoneOffset = timezoneOffset;
	}
	
	public void setTimezoneOffset() {
	    DateTimeZone tz = DateTimeZone.getDefault();
	    Long instant = DateTime.now().getMillis();

	    long offsetInMilliseconds = tz.getOffset(instant);
	    long hours = TimeUnit.MILLISECONDS.toHours( offsetInMilliseconds );
    
		this.timezoneOffset = (int) hours;
	}
	
}


