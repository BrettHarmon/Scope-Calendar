package scopeCalendar.models;

import java.io.Serializable;
import javax.persistence.Entity;
import javax.persistence.Table;

import org.hibernate.annotations.Target;
import org.hibernate.annotations.Type;
import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;
import org.joda.time.Interval;

import javax.persistence.*;
import java.util.Date;
import java.util.concurrent.TimeUnit;


@Entity
@Table(name = "events")
public class Event implements Serializable {

    private static final long serialVersionUID = 3257654234123443123L;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "eventId")
    private long eventId;

    @Column(name = "name")
    private String name;

    @Column(name = "description", columnDefinition="TEXT")
    private String description;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="organizationId", nullable=false)
	private Organization organization;

    @Column(name = "startDate")
    @Type(type="org.joda.time.contrib.hibernate.PersistentDateTime")
    private DateTime start;

    @Column(name = "endDate")
    @Type(type="org.joda.time.contrib.hibernate.PersistentDateTime")
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

    public DateTime getStateDate() {
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

	    String name = tz.getName(instant);

	    long offsetInMilliseconds = tz.getOffset(instant);
	    long hours = TimeUnit.MILLISECONDS.toHours( offsetInMilliseconds );
    
		this.timezoneOffset = (int) hours;
	}
	
}


