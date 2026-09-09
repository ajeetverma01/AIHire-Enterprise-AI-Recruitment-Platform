package dev.ajeetverma01.aihire.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController("/api/candidate")
public class CandidateController {

    @GetMapping("/dashboard")
    public ResponseEntity<String> getAdminDashboard(){
        return ResponseEntity.ok("Candidate dashboard");
    }
}
