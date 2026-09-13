package dev.ajeetverma01.aihire.service;

import dev.ajeetverma01.aihire.dto.ChangeJobStatusRequest;
import dev.ajeetverma01.aihire.dto.CreateJobRequest;
import dev.ajeetverma01.aihire.dto.JobResponse;
import dev.ajeetverma01.aihire.dto.UpdateJobRequest;
import dev.ajeetverma01.aihire.entity.Job;
import dev.ajeetverma01.aihire.entity.JobStatus;
import dev.ajeetverma01.aihire.entity.User;
import dev.ajeetverma01.aihire.exception.InvalidJobStatusTransitionException;
import dev.ajeetverma01.aihire.exception.JobNotFoundException;
import dev.ajeetverma01.aihire.exception.UnauthorizedAccessException;
import dev.ajeetverma01.aihire.exception.UserNotFoundException;
import dev.ajeetverma01.aihire.repository.JobRepository;
import dev.ajeetverma01.aihire.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public JobService(
            JobRepository jobRepository,
            UserRepository userRepository
    ) {
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
    }

    public JobResponse createJob(CreateJobRequest request, String recruiterEmail) {

        User recruiter = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() ->
                        new UserNotFoundException("Recruiter not found")
                );

        Job job = Job.builder()
                .title(request.title())
                .description(request.description())
                .location(request.location())
                .employmentType(request.employmentType())
                .experienceRequired(request.experienceRequired())
                .salary(request.salary())
                .recruiter(recruiter)
                .build();

        Job savedJob = jobRepository.save(job);

        return mapToResponse(savedJob);
    }

    private JobResponse mapToResponse(Job job) {

        return new JobResponse(
                job.getId(),
                job.getTitle(),
                job.getDescription(),
                job.getLocation(),
                job.getEmploymentType(),
                job.getExperienceRequired(),
                job.getSalary(),
                job.getStatus(),
                job.getRecruiter().getId(),
                job.getCreatedAt(),
                job.getUpdatedAt()
        );
    }

    public List<JobResponse> getRecruiterJobs(String recruiterEmail) {

        User recruiter = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() ->
                        new UserNotFoundException("Recruiter not found")
                );

        List<Job> jobs = jobRepository.findByRecruiterId(recruiter.getId());

        return jobs.stream()
                .map(this::mapToResponse)
                .toList();
    }


    public JobResponse getJobById(
            UUID jobId,
            String recruiterEmail
    ) {

        User recruiter = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() ->
                        new UserNotFoundException("Recruiter not found")
                );

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() ->
                        new JobNotFoundException("Job not found")
                );

        if (!job.getRecruiter().getId().equals(recruiter.getId())) {
            throw new UnauthorizedAccessException("You are not allowed to access this job");
        }

        return mapToResponse(job);
    }

    public JobResponse updateJob(
            UUID jobId,
            UpdateJobRequest request,
            String recruiterEmail
    ) {

        User recruiter = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() ->
                        new UserNotFoundException("Recruiter not found")
                );

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() ->
                        new JobNotFoundException("Job not found")
                );

        if (!job.getRecruiter().getId().equals(recruiter.getId())) {
            throw new UnauthorizedAccessException(
                    "You are not allowed to update this job"
            );
        }

        job.setTitle(request.title());
        job.setDescription(request.description());
        job.setLocation(request.location());
        job.setEmploymentType(request.employmentType());
        job.setExperienceRequired(request.experienceRequired());
        job.setSalary(request.salary());

        Job updatedJob = jobRepository.save(job);

        return mapToResponse(updatedJob);
    }

    public void deleteJob(
            UUID jobId,
            String recruiterEmail
    ) {

        User recruiter = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() ->
                        new UserNotFoundException("Recruiter not found")
                );

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() ->
                        new JobNotFoundException("Job not found")
                );

        if (!job.getRecruiter().getId().equals(recruiter.getId())) {
            throw new UnauthorizedAccessException(
                    "You are not allowed to delete this job"
            );
        }

        jobRepository.delete(job);
    }


    public JobResponse changeJobStatus(UUID jobId, ChangeJobStatusRequest req, String recEmail){
        User recruiter = userRepository.findByEmail(recEmail).orElseThrow(()->new UserNotFoundException("Recruiter " +
                "not found"));
        Job job = jobRepository.findById(jobId).orElseThrow(()-> new JobNotFoundException("Job not found"));
        if (!job.getRecruiter().getId().equals(recruiter.getId())) {
            throw new UnauthorizedAccessException(
                    "You are not allowed to change this job status"
            );
        }
        JobStatus currentStatus = job.getStatus();
        JobStatus newStatus = req.status();
        if (currentStatus == JobStatus.DRAFT && newStatus == JobStatus.OPEN) {
            job.setStatus(JobStatus.OPEN);
        } else if (currentStatus == JobStatus.OPEN && newStatus == JobStatus.CLOSED) {
            job.setStatus(JobStatus.CLOSED);
        } else {
            throw new InvalidJobStatusTransitionException(
                    "Invalid job status transition from "
                            + currentStatus + " to " + newStatus
            );
        }

        Job updatedJob = jobRepository.save(job);

        return mapToResponse(updatedJob);
    }
}