package scopeCalendar.config;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.filter.CommonsRequestLoggingFilter;

import scopeCalendar.services.CustomUserDetailsService;



	@Configuration
	@EnableWebSecurity
	public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
		
		@Autowired
		private CustomUserDetailsService userDetailsService;
		
		@Bean
		public PasswordEncoder encoder() {
		    return new BCryptPasswordEncoder();
		}
		
		@Bean
		public CommonsRequestLoggingFilter requestLoggingFilter() {
		    CommonsRequestLoggingFilter loggingFilter = new CommonsRequestLoggingFilter();
		    loggingFilter.setIncludeClientInfo(true);
		    loggingFilter.setIncludeQueryString(true);
		    loggingFilter.setIncludePayload(true);
		    return loggingFilter;
		}

		
		@Bean
		public DaoAuthenticationProvider authenticationProvider() {
		    DaoAuthenticationProvider authProvider
		      = new DaoAuthenticationProvider();
		    authProvider.setUserDetailsService(userDetailsService);
		    authProvider.setPasswordEncoder(encoder());
		    return authProvider;
		}
		
		   @Override
		    public void configure(WebSecurity web) throws Exception {
		        web.debug(true);
		    }
		   
		@Override
	    protected void configure(HttpSecurity http) throws Exception {
	        http
	            .authorizeRequests()
	                .antMatchers("/", "/signup", "/login").permitAll()
	                .antMatchers("/test").authenticated()
	                .and()
	            .formLogin()
	                .loginPage("/signin").loginProcessingUrl("/signin").permitAll()
	                .defaultSuccessUrl("/test")
	                .failureUrl("/fail")
	                .usernameParameter("email")
	                .passwordParameter("password")
	                .and()
	                .httpBasic().and().csrf().disable()
	            .logout()
	                .permitAll();
	   
	    }
		
		@Override
	    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
	    	auth.authenticationProvider(authenticationProvider());
	    }
	    

	}
