package scopeCalendar.models;

import java.io.Serializable;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Id;
import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import java.util.Date;


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

    @Column(name = "description")
    private String description;

    @Column(name = "organizationId")
    private long organizationId;

    @Column(name = "creatorId")
    private long creatorId ;

    @Column(name = "startDate")
    private Date start;

    @Column(name = "endDate")
    private Date end;

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

    public long getOrganization() {
        return organizationId;
    }

    public void setOrganization(Organization org) {
        this.organizationId = org.getOrganizationId();
    }

    public long getCreator() {
        return creatorId;
    }

    public void setCreator(User user) {
        this.creatorId = user.getUserId() ;
    }

    public Date getStartDate() {
        return start;
    }

    public void setStartDate(Date startDate) {
        this.start = startDate;
    }

    public Date getStateDate() {
        return end;
    }

    public void setEndDate(Date endDate) {
        this.end = endDate;
    }
}


