package dev.ajeetverma01.aihire.dto;

import dev.ajeetverma01.aihire.entity.ApplicationStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record ApplicationResponse(

        UUID applicationId,

        UUID jobId,

        String jobTitle,

        ApplicationStatus status,

        LocalDateTime appliedAt

) {}