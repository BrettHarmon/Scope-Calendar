package scopeCalendar.config;


import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.web.filter.CommonsRequestLoggingFilter;

import scopeCalendar.Application;
import scopeCalendar.models.User;
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
		        //web.debug(true);
		    }
		   
		@Override
	    protected void configure(HttpSecurity http) throws Exception {
	        http
	            .authorizeRequests()
	                .antMatchers("/", "/signup", "/login", "/signin").permitAll()
	                .anyRequest().authenticated()
	                .and()
	            .formLogin()
	                .loginPage("/signin").loginProcessingUrl("/signin").permitAll()
	                .successHandler(successHandler())
	                .failureUrl("/fail")
	                .usernameParameter("identity")
	                .passwordParameter("password")
	                .and()
	                .httpBasic().and().csrf().disable()
	            .logout()
	                .permitAll();
	        
	        if(Application.DEBUG_MODE) {
	        	http.authorizeRequests().anyRequest().permitAll();
	        }
	   
	    }
		
		@Override
	    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
	    	auth.authenticationProvider(authenticationProvider());
	    }
		
	    private AuthenticationSuccessHandler successHandler() {
	        return new SimpleUrlAuthenticationSuccessHandler() {
	            public void onAuthenticationSuccess(HttpServletRequest request,
	                    HttpServletResponse response, Authentication authentication)
	                    throws IOException, ServletException {
	                response.setContentType("application/json;charset=UTF-8");
	                HttpSession session = request.getSession(false);
	            }
	        };
	    }
	    

	}
