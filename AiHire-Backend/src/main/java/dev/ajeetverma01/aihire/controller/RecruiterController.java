package dev.ajeetverma01.aihire.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/recruiter")
public class RecruiterController {

    @GetMapping("/dashboard")
    public ResponseEntity<String> getRecruiterDashboard() {
        return ResponseEntity.ok("Recruiter dashboard");
    }
}