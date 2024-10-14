package com.Jacob.ridesafebackend.config;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


@Configuration
public class WebConfig implements WebMvcConfigurer {

	public WebConfig() {
		// TODO Auto-generated constructor stub
	}
	
	@Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000") // Allow CORS from this origin
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS"); // Allowed HTTP methods
    }

}
