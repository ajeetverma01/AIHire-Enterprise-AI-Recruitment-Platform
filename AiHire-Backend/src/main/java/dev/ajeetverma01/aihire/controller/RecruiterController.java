package dev.ajeetverma01.aihire.controller;

import dev.ajeetverma01.aihire.dto.ChangeApplicationStatusRequest;
import dev.ajeetverma01.aihire.dto.RecruiterApplicationResponse;
import dev.ajeetverma01.aihire.service.ApplicationService;
import dev.ajeetverma01.aihire.service.JobService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/recruiter")
public class RecruiterController {

    private final JobService jobService;
    private final ApplicationService applicationService;

    public RecruiterController(
            JobService jobService,
            ApplicationService applicationService
    ) {
        this.jobService = jobService;
        this.applicationService = applicationService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<String> getRecruiterDashboard() {
        return ResponseEntity.ok("Recruiter dashboard");
    }

    @GetMapping("/applications")
    public ResponseEntity<List<RecruiterApplicationResponse>> getApplications(Authentication authentication) {

        String recruiterEmail = authentication.getName();

        List<RecruiterApplicationResponse> applications =
                applicationService.getRecruiterApplications(recruiterEmail);

        return ResponseEntity.ok(applications);
    }

    @PatchMapping("/applications/{applicationId}/status")
    public ResponseEntity<Void> updateApplicationStatus(
            @PathVariable UUID applicationId,
            @Valid @RequestBody ChangeApplicationStatusRequest request,
            Authentication authentication
    ) {

        String recruiterEmail = authentication.getName();

        applicationService.updateApplicationStatus(
                applicationId,
                request,
                recruiterEmail
        );

        return ResponseEntity.noContent().build();
    }
}