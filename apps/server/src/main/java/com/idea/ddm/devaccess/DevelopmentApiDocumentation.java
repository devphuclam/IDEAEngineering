package com.idea.ddm.devaccess;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

/** Same-origin documentation only. Existing security chain owns authentication and CSRF. */
@RestController
@ConditionalOnProperty(name = "idea.dev-api.enabled", havingValue = "true")
final class DevelopmentApiDocumentation {
    private static final String WEBJAR = "META-INF/resources/webjars/swagger-ui/5.32.14/";

    @GetMapping({"/dev-api", "/dev-api/"})
    ResponseEntity<Resource> index() { return resource("dev-access/index.html", MediaType.TEXT_HTML); }

    @GetMapping("/dev-api/openapi.json")
    ResponseEntity<Resource> contract() { return resource("dev-access/openapi.json", MediaType.APPLICATION_JSON); }

    @GetMapping("/dev-api/boot.js")
    ResponseEntity<Resource> initializer() { return resource("dev-access/boot.js", MediaType.valueOf("text/javascript")); }

    @GetMapping("/dev-api/assets/{file}")
    ResponseEntity<Resource> asset(@PathVariable String file) {
        return switch (file) {
            case "swagger-ui.css" -> resource(WEBJAR + file, MediaType.valueOf("text/css"));
            case "swagger-ui-bundle.js" -> resource(WEBJAR + file, MediaType.valueOf("text/javascript"));
            case "swagger-ui-bundle.js.LICENSE.txt", "swagger-ui-es-bundle-core.js.LICENSE.txt",
                    "swagger-ui-es-bundle.js.LICENSE.txt", "swagger-ui-standalone-preset.js.LICENSE.txt" ->
                    resource(WEBJAR + file, MediaType.TEXT_PLAIN);
            default -> ResponseEntity.notFound().build();
        };
    }

    @GetMapping("/dev-api/notices/{file}")
    ResponseEntity<Resource> notice(@PathVariable String file) {
        return switch (file) {
            case "LICENSE.txt", "NOTICE.txt" -> resource("third-party/swagger-ui/" + file, MediaType.TEXT_PLAIN);
            default -> ResponseEntity.notFound().build();
        };
    }

    private ResponseEntity<Resource> resource(String path, MediaType type) {
        var resource = new ClassPathResource(path);
        if (!resource.exists()) return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).build();
        return ResponseEntity.ok().contentType(type).header("Cache-Control", "no-store").body(resource);
    }
}
