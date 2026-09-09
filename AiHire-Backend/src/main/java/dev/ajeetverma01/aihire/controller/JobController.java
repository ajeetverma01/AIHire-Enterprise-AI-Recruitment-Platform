package dev.ajeetverma01.aihire.controller;

import dev.ajeetverma01.aihire.dto.CreateJobRequest;
import dev.ajeetverma01.aihire.dto.JobResponse;
import dev.ajeetverma01.aihire.dto.UpdateJobRequest;
import dev.ajeetverma01.aihire.service.JobService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/recruiter/jobs")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @PostMapping
    public ResponseEntity<JobResponse> createJob(
            @Valid @RequestBody CreateJobRequest request,
            Authentication authentication
    ) {

        String recruiterEmail = authentication.getName();

        JobResponse response =
                jobService.createJob(request, recruiterEmail);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }
    @GetMapping
    public ResponseEntity<List<JobResponse>> getRecruiterJobs(
            Authentication authentication
    ) {

        String recruiterEmail = authentication.getName();

        List<JobResponse> jobs =
                jobService.getRecruiterJobs(recruiterEmail);

        return ResponseEntity.ok(jobs);
    }

    @GetMapping("/{jobId}")
    public ResponseEntity<JobResponse> getJobById(
            @PathVariable UUID jobId,
            Authentication authentication
    ) {

        String recruiterEmail = authentication.getName();

        JobResponse response =
                jobService.getJobById(jobId, recruiterEmail);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{jobId}")
    public ResponseEntity<JobResponse> updateJob(
            @PathVariable UUID jobId,
            @Valid @RequestBody UpdateJobRequest request,
            Authentication authentication
    ) {

        String recruiterEmail = authentication.getName();

        JobResponse response =
                jobService.updateJob(
                        jobId,
                        request,
                        recruiterEmail
                );

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{jobId}")
    public ResponseEntity<Void> deleteJob(
            @PathVariable UUID jobId,
            Authentication authentication
    ) {

        String recruiterEmail = authentication.getName();

        jobService.deleteJob(jobId, recruiterEmail);

        return ResponseEntity.noContent().build();
    }
}