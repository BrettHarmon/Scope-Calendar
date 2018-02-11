package scopeCalendar.models;
//Here are wrappers for complex View Models and Compound Request models
public class CompoundModels {
	
	public static class CreateAccountCM {
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

}
