package dev.ajeetverma01.aihire.ai.dto;

import java.util.List;

public record ResumeAnalysisResponse(
        String summary,
        List<String> skills,
        List<String> experience,
        List<String> strengths,
        List<String> missingSkills,
        List<String> suggestions
) {
}