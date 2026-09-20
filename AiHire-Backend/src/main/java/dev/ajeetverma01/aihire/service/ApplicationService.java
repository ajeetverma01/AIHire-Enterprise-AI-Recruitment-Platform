package dev.ajeetverma01.aihire.service;

import dev.ajeetverma01.aihire.dto.ApplicationResponse;
import dev.ajeetverma01.aihire.dto.CreateApplicationRequest;
import dev.ajeetverma01.aihire.entity.Application;
import dev.ajeetverma01.aihire.entity.Job;
import dev.ajeetverma01.aihire.entity.JobStatus;
import dev.ajeetverma01.aihire.entity.User;
import dev.ajeetverma01.aihire.exception.DuplicateResourceException;
import dev.ajeetverma01.aihire.exception.JobNotFoundException;
import dev.ajeetverma01.aihire.exception.UserNotFoundException;
import dev.ajeetverma01.aihire.repository.ApplicationRepository;
import dev.ajeetverma01.aihire.repository.JobRepository;
import dev.ajeetverma01.aihire.repository.UserRepository;
import org.springframework.stereotype.Service;
import dev.ajeetverma01.aihire.exception.InvalidJobStatusException;

import java.util.List;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public ApplicationService(
            ApplicationRepository applicationRepository,
            JobRepository jobRepository,
            UserRepository userRepository
    ) {
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
    }

    public void applyToJob(CreateApplicationRequest request, String candidateEmail) {

        User candidate = userRepository.findByEmail(candidateEmail)
                .orElseThrow(() ->
                        new UserNotFoundException("Candidate not found")
                );

        Job job = jobRepository.findById(request.jobId())
                .orElseThrow(() ->
                        new JobNotFoundException("Job not found")
                );

        if (job.getStatus() != JobStatus.OPEN) {
            throw new InvalidJobStatusException(
                    "You can only apply to an open job"
            );
        }

        boolean alreadyApplied =
                applicationRepository.existsByJobIdAndCandidateId(
                        job.getId(),
                        candidate.getId()
                );

        if (alreadyApplied) {
            throw new DuplicateResourceException(
                    "You have already applied for this job"
            );
        }

        Application application = Application.builder()
                .job(job)
                .candidate(candidate)
                .build();

        applicationRepository.save(application);
    }

    public List<ApplicationResponse> getMyApplications(String candidateEmail) {

        User candidate = userRepository.findByEmail(candidateEmail)
                .orElseThrow(() -> new UserNotFoundException("Candidate not found"));

        List<Application> applications =
                applicationRepository.findByCandidateId(candidate.getId());

        return applications.stream()
                .map(application -> new ApplicationResponse(
                        application.getId(),
                        application.getJob().getId(),
                        application.getJob().getTitle(),
                        application.getStatus(),
                        application.getAppliedAt()
                ))
                .toList();
    }
}