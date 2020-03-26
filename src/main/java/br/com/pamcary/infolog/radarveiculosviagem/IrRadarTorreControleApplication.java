package br.com.pamcary.infolog.radarveiculosviagem;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.annotation.PropertySource;

import com.newrelic.api.agent.Trace;

@SpringBootApplication
@PropertySource("classpath:application.properties")
public class IrRadarTorreControleApplication {
	/*JAR*/
	public static void main(String[] args) {
		SpringApplication.run(IrRadarTorreControleApplication.class, args);
	}

	/*WAR*/
	@Trace
	protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
		return builder.sources(IrRadarTorreControleApplication.class);
	}

}
