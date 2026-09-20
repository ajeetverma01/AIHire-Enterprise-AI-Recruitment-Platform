package dev.ajeetverma01.aihire.repository;

import dev.ajeetverma01.aihire.entity.EmploymentType;
import dev.ajeetverma01.aihire.entity.Job;
import dev.ajeetverma01.aihire.entity.JobStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.UUID;

public interface JobRepository extends JpaRepository<Job, UUID>, JpaSpecificationExecutor<Job> {
    List<Job> findByRecruiterId(UUID recruiterId);
    List<Job> findByStatus(JobStatus status);
    List<Job> findByStatusAndLocationContainingIgnoreCase(JobStatus status, String location);
    List<Job> findByStatusAndEmploymentType(JobStatus status, EmploymentType employmentType);
}
