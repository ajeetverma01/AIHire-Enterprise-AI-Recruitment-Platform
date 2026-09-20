package dev.ajeetverma01.aihire.service;

import dev.ajeetverma01.aihire.dto.ApplicationResponse;
import dev.ajeetverma01.aihire.dto.ChangeApplicationStatusRequest;
import dev.ajeetverma01.aihire.dto.CreateApplicationRequest;
import dev.ajeetverma01.aihire.dto.RecruiterApplicationResponse;
import dev.ajeetverma01.aihire.entity.*;
import dev.ajeetverma01.aihire.exception.*;
import dev.ajeetverma01.aihire.repository.ApplicationRepository;
import dev.ajeetverma01.aihire.repository.JobRepository;
import dev.ajeetverma01.aihire.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

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


    public List<RecruiterApplicationResponse> getRecruiterApplications(String recruiterEmail) {

        User recruiter = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() ->
                        new UserNotFoundException("Recruiter not found")
                );

        List<Application> applications =
                applicationRepository.findByJobRecruiterId(
                        recruiter.getId()
                );

        return applications.stream()
                .map(application -> new RecruiterApplicationResponse(
                        application.getId(),
                        application.getJob().getId(),
                        application.getJob().getTitle(),
                        application.getCandidate().getId(),
                        application.getCandidate().getEmail(),
                        application.getStatus(),
                        application.getAppliedAt()
                ))
                .toList();
    }

    private boolean isValidStatusTransition(
            ApplicationStatus currentStatus,
            ApplicationStatus newStatus
    ) {

        return switch (currentStatus) {

            case APPLIED ->
                    newStatus == ApplicationStatus.SHORTLISTED
                            || newStatus == ApplicationStatus.REJECTED;

            case SHORTLISTED ->
                    newStatus == ApplicationStatus.HIRED;

            case REJECTED, HIRED ->
                    false;
        };
    }

    public void updateApplicationStatus(
            UUID applicationId,
            ChangeApplicationStatusRequest request,
            String recruiterEmail
    ) {

        User recruiter = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() ->
                        new UserNotFoundException("Recruiter not found")
                );

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() ->
                        new ApplicationNotFoundException("Application not found")
                );

        if (!application.getJob().getRecruiter().getId()
                .equals(recruiter.getId())) {

            throw new UnauthorizedAccessException(
                    "You are not allowed to update this application"
            );
        }

        ApplicationStatus currentStatus = application.getStatus();
        ApplicationStatus newStatus = request.status();

        if (!isValidStatusTransition(currentStatus, newStatus)) {

            throw new InvalidApplicationStatusTransitionException(
                    "Invalid application status transition from "
                            + currentStatus
                            + " to "
                            + newStatus
            );
        }

        application.setStatus(newStatus);

        applicationRepository.save(application);
    }
}