package scopeCalendar.tests;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.util.SerializationUtils;

import com.fasterxml.jackson.databind.ObjectMapper;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import scopeCalendar.models.CompoundModels.CreateAccountCM;
import scopeCalendar.models.User;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
public class UserControllerTest {
	
	@Autowired
	private MockMvc mvc;

	@Test
	public void createAccountTest() throws Exception {
		CreateAccountCM users = new CreateAccountCM();
		User user = new User();
		users.setPassword2("testpassword");
		user.setEmail("testemail@email.com");
		user.setPassword("testpassword");
		user.setUsername("testuser");
		users.setUser(user);
		ObjectMapper mapper = new ObjectMapper();
		
		this.mvc.perform(post("/signup").content(mapper.writeValueAsString(users))
				.contentType(MediaType.APPLICATION_JSON))
		        .andExpect(status().isOk()).andReturn();
		    
	}
}
