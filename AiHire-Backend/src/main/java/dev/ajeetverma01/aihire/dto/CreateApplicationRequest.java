package dev.ajeetverma01.aihire.dto;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record CreateApplicationRequest(

        @NotNull(message = "Job ID is required")
        UUID jobId

) {
}