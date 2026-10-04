package dev.ajeetverma01.aihire.ai.dto;

import java.util.List;

public record ResumeJobMatchResponse(
        int matchScore,
        String overallAssessment,
        List<String> matchingSkills,
        List<String> missingSkills,
        List<String> matchingExperience,
        List<String> skillGaps,
        List<String> recommendations
) {
}