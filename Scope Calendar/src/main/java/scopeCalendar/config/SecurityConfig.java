package scopeCalendar.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import scopeCalendar.services.CustomUserDetailsService;


public class SecurityConfig {

	@Configuration
	@EnableWebMvc
	public class WebSecurityConfig extends WebMvcConfigurerAdapter {
		
		@Autowired
		private CustomUserDetailsService userDetailsService;
		
		@Bean
		public PasswordEncoder encoder() {
		    return new BCryptPasswordEncoder(11);
		}

		
		@Bean
		public DaoAuthenticationProvider authenticationProvider() {
		    DaoAuthenticationProvider authProvider
		      = new DaoAuthenticationProvider();
		    authProvider.setUserDetailsService(userDetailsService);
		    authProvider.setPasswordEncoder(encoder());
		    return authProvider;
		}
		
	    protected void configure(HttpSecurity http) throws Exception {
	        http
	            .authorizeRequests()
	                .antMatchers("/").permitAll()
	                .antMatchers("/profile").authenticated()
	                .anyRequest().hasAuthority("ROLE_ADMIN")
	                .and()
	            .formLogin()
	                .loginPage("/login").permitAll()
	                .defaultSuccessUrl("/")
	                .failureUrl("/login?error=true")
	                .usernameParameter("username")
	                .passwordParameter("password")
	                .and()
	            .logout()
	                .permitAll();
	    }

	    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
	    	auth.authenticationProvider(authenticationProvider());
	    }
	    

	}
}
