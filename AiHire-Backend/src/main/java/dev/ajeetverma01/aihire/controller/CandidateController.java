package dev.ajeetverma01.aihire.controller;

import dev.ajeetverma01.aihire.dto.ApplicationResponse;
import dev.ajeetverma01.aihire.dto.JobResponse;
import dev.ajeetverma01.aihire.service.ApplicationService;
import dev.ajeetverma01.aihire.service.JobService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import dev.ajeetverma01.aihire.entity.EmploymentType;
import org.springframework.web.bind.annotation.RequestParam;
import dev.ajeetverma01.aihire.dto.CreateApplicationRequest;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@RestController
@RequestMapping("/api/candidate")
public class CandidateController {

    private final JobService jobService;
    private final ApplicationService applicationService;

    public CandidateController(JobService jobService, ApplicationService applicationService) {
        this.jobService = jobService;
        this.applicationService = applicationService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<String> getCandidateDashboard() {
        return ResponseEntity.ok("Candidate dashboard");
    }

    @GetMapping("/jobs")
    public ResponseEntity<List<JobResponse>> searchJobs(

            @RequestParam(required = false)
            String location,

            @RequestParam(required = false)
            EmploymentType employmentType
    ) {

        List<JobResponse> jobs =
                jobService.searchOpenJobs(
                        location,
                        employmentType
                );

        return ResponseEntity.ok(jobs);
    }

    @PostMapping("/applications")
    public ResponseEntity<Void> applyToJob(
            @Valid @RequestBody CreateApplicationRequest request,
            Authentication authentication
    ) {

        String candidateEmail = authentication.getName();

        applicationService.applyToJob(request, candidateEmail);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/applications")
    public ResponseEntity<List<ApplicationResponse>> getMyApplications(
            Authentication authentication
    ) {

        String candidateEmail = authentication.getName();

        List<ApplicationResponse> applications =
                applicationService.getMyApplications(candidateEmail);

        return ResponseEntity.ok(applications);
    }
}