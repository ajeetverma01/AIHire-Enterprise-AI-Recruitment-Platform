package dev.ajeetverma01.aihire.dto;

import dev.ajeetverma01.aihire.entity.ApplicationStatus;
import jakarta.validation.constraints.NotNull;

public record ChangeApplicationStatusRequest(
        @NotNull(message = "Application status is required")
        ApplicationStatus status
) {}