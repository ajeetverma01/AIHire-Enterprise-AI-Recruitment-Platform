package dev.ajeetverma01.aihire.specification;

import dev.ajeetverma01.aihire.entity.EmploymentType;
import dev.ajeetverma01.aihire.entity.Job;
import dev.ajeetverma01.aihire.entity.JobStatus;
import org.springframework.data.jpa.domain.Specification;

public class JobSpecification {

    public static Specification<Job> hasStatus(JobStatus status) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(
                        root.get("status"),
                        status
                );
    }

    public static Specification<Job> hasLocation(String location) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("location")),
                        "%" + location.toLowerCase() + "%"
                );
    }

    public static Specification<Job> hasEmploymentType(
            EmploymentType employmentType
    ) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(
                        root.get("employmentType"),
                        employmentType
                );
    }
}