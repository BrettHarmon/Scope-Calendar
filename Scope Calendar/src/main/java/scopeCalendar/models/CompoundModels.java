package scopeCalendar.models;

import java.util.List;

import javax.validation.Valid;

//Here are wrappers for complex View Models and Compound Request models
public class CompoundModels {
	
	public static class CreateAccountCM {
		@Valid
		public User user;
		public String password2;
		public User getUser() {
			return user;
		}
		public String getPassword2() {
			return password2;
		}
		public void setUser(User user) {
			this.user = user;
		}
		public void setPassword2(String password2) {
			this.password2 = password2;
		}
		
	}
	
	public static class CreateOrganizationCM {
		@Valid
		public Organization organization;
		public Organization getOrganization() {
			return organization;
		}

		public void setUser(Organization organization) {
			this.organization = organization;
		}
		
	}

	public static class SimpleId{
		public long Id;
		public long getId(){
			return Id;
		}
		public void getId(long Id){
			this.Id = Id;
		}
	}
	
	public static class OrganizationRespone{
		String name;
		String description;
		String subscribers;
		String isSubscribed;
		List<Event> events;
		
		public OrganizationRespone() { }
		
		public String getName() {
			return name;
		}
		public String getDescription() {
			return description;
		}
		public String getSubscribers() {
			return subscribers;
		}
		public String getIsSubscribed() {
			return isSubscribed;
		}
		public List<Event> getEvents() {
			return events;
		}
		public void setName(String name) {
			this.name = name;
		}
		public void setDescription(String description) {
			this.description = description;
		}
		public void setSubscribers(String subscribers) {
			this.subscribers = subscribers;
		}
		public void setIsSubscribed(String isSubscribed) {
			this.isSubscribed = isSubscribed;
		}
		public void setEvents(List<Event> events) {
			this.events = events;
		}
	}
}
