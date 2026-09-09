package dev.ajeetverma01.aihire.dto;

import dev.ajeetverma01.aihire.entity.EmploymentType;
import dev.ajeetverma01.aihire.entity.JobStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record JobResponse(

        UUID id,
        String title,
        String description,
        String location,
        EmploymentType employmentType,
        String experienceRequired,
        String salary,
        JobStatus status,
        UUID recruiterId,
        LocalDateTime createdAt,
        LocalDateTime updatedAt

) {
}