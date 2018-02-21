package scopeCalendar;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Application {

	public static final boolean DEBUG_MODE = java.lang.management.ManagementFactory.getRuntimeMXBean().
		    getInputArguments().toString().indexOf("-agentlib:jdwp") > 0;
	
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
        //http://localhost:8080/
    }
}