package dev.ajeetverma01.aihire.controller;

import dev.ajeetverma01.aihire.dto.JobResponse;
import dev.ajeetverma01.aihire.service.JobService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import dev.ajeetverma01.aihire.entity.EmploymentType;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@RestController
@RequestMapping("/api/candidate")
public class CandidateController {

    private final JobService jobService;

    public CandidateController(JobService jobService) {
        this.jobService = jobService;
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
}