package com.idea.ddm;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(excludeName = "org.springframework.boot.security.autoconfigure.UserDetailsServiceAutoConfiguration")
public class IdeaServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(IdeaServerApplication.class, args);
    }
}
