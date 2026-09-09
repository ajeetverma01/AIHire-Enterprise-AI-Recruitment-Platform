package dev.ajeetverma01.aihire.dto;

import dev.ajeetverma01.aihire.entity.EmploymentType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UpdateJobRequest(

        @NotBlank(message = "Job title is required")
        @Size(max = 150, message = "Job title cannot exceed 150 characters")
        String title,

        @NotBlank(message = "Job description is required")
        String description,

        @NotBlank(message = "Location is required")
        @Size(max = 100, message = "Location cannot exceed 100 characters")
        String location,

        @NotNull(message = "Employment type is required")
        EmploymentType employmentType,

        @NotBlank(message = "Experience requirement is required")
        @Size(max = 100, message = "Experience requirement cannot exceed 100 characters")
        String experienceRequired,

        @Size(max = 100, message = "Salary cannot exceed 100 characters")
        String salary

) {
}