package dev.ajeetverma01.aihire.resume.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record ResumeAnalysisResponse(
        UUID id,
        UUID resumeId,
        String summary,
        List<String> skills,
        List<String> experience,
        List<String> strengths,
        List<String> missingSkills,
        List<String> suggestions,
        LocalDateTime analyzedAt
) {
}