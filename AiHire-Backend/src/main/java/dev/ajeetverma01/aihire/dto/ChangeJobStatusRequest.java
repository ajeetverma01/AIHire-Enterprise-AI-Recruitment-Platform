package dev.ajeetverma01.aihire.dto;

import dev.ajeetverma01.aihire.entity.JobStatus;
import jakarta.validation.constraints.NotNull;

public record ChangeJobStatusRequest(
        @NotNull(message = "Job status is required")
        JobStatus status
) {
}
