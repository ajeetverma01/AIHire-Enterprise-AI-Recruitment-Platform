package dev.ajeetverma01.aihire.dto;

import dev.ajeetverma01.aihire.entity.ApplicationStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record RecruiterApplicationResponse(

        UUID applicationId,

        UUID jobId,

        String jobTitle,

        UUID candidateId,

        String candidateEmail,

        ApplicationStatus status,

        LocalDateTime appliedAt

) {
}