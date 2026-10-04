package dev.ajeetverma01.aihire.resume.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record ResumeJobMatchApiResponse(
        UUID id,
        UUID resumeId,
        UUID jobId,
        String jobTitle,
        int matchScore,
        String overallAssessment,
        List<String> matchingSkills,
        List<String> missingSkills,
        List<String> matchingExperience,
        List<String> skillGaps,
        List<String> recommendations,
        LocalDateTime matchedAt
) {
}