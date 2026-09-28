package com.idea.ddm;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
class ProcessHealthController {
    @GetMapping("/health")
    Map<String, String> processHealth() {
        return Map.of("status", "UP");
    }
}
