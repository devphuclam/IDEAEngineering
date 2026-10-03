package com.idea.qualification;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.SpringBootVersion;
import org.springframework.boot.WebApplicationType;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

/** Synthetic non-web packaging probe; not a Gateway or supported product endpoint. */
@SpringBootApplication
public class BootProbe {
    public static void main(String[] args) {
        if (Runtime.version().feature() != 25 || !"4.1.1".equals(SpringBootVersion.getVersion())) {
            throw new IllegalStateException("Unexpected qualified runtime");
        }
        SpringApplication application = new SpringApplication(BootProbe.class);
        application.setWebApplicationType(WebApplicationType.NONE);
        ConfigurableApplicationContext context = application.run(args);
        try (context) {
            if (!context.isActive() || !(context instanceof AnnotationConfigApplicationContext)) {
                throw new IllegalStateException("Expected active non-web context");
            }
            System.out.println("T027_NON_WEB_CONTEXT_UP=PASS;BOOT=4.1.1;JAVA=25");
        }
        if (context.isActive()) {
            throw new IllegalStateException("Context did not close");
        }
        System.out.println("T027_NON_WEB_CONTEXT_CLOSED=PASS");
    }
}
