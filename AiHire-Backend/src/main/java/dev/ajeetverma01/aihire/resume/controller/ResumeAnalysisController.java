package dev.ajeetverma01.aihire.resume.controller;

import dev.ajeetverma01.aihire.resume.dto.ResumeAnalysisResponse;
import dev.ajeetverma01.aihire.resume.entity.ResumeAnalysis;
import dev.ajeetverma01.aihire.resume.service.ResumeAnalysisService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/resumes")
public class ResumeAnalysisController {

    private final ResumeAnalysisService resumeAnalysisService;

    public ResumeAnalysisController(
            ResumeAnalysisService resumeAnalysisService
    ) {
        this.resumeAnalysisService = resumeAnalysisService;
    }

    @PostMapping("/{resumeId}/analysis")
    public ResponseEntity<ResumeAnalysisResponse> analyzeResume(
            @PathVariable UUID resumeId,
            Authentication authentication
    ) {

        String candidateEmail = authentication.getName();

        ResumeAnalysis analysis =
                resumeAnalysisService.analyzeResume(
                        resumeId,
                        candidateEmail
                );

        ResumeAnalysisResponse response =
                new ResumeAnalysisResponse(
                        analysis.getId(),
                        analysis.getResume().getId(),
                        analysis.getSummary(),
                        analysis.getSkills(),
                        analysis.getExperience(),
                        analysis.getStrengths(),
                        analysis.getMissingSkills(),
                        analysis.getSuggestions(),
                        analysis.getAnalyzedAt()
                );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{resumeId}/analysis")
    public ResponseEntity<ResumeAnalysisResponse> getResumeAnalysis(
            @PathVariable UUID resumeId,
            Authentication authentication
    ) {

        ResumeAnalysis analysis =
                resumeAnalysisService.getMyResumeAnalysis(
                        resumeId,
                        authentication.getName()
                );

        ResumeAnalysisResponse response =
                new ResumeAnalysisResponse(
                        analysis.getId(),
                        analysis.getResume().getId(),
                        analysis.getSummary(),
                        analysis.getSkills(),
                        analysis.getExperience(),
                        analysis.getStrengths(),
                        analysis.getMissingSkills(),
                        analysis.getSuggestions(),
                        analysis.getAnalyzedAt()
                );

        return ResponseEntity.ok(response);
    }


    @GetMapping("/my-analyses")
    public ResponseEntity<List<ResumeAnalysisResponse>> getMyResumeAnalyses(
            Authentication authentication
    ) {

        List<ResumeAnalysisResponse> responses =
                resumeAnalysisService
                        .getMyResumeAnalyses(authentication.getName())
                        .stream()
                        .map(analysis -> new ResumeAnalysisResponse(
                                analysis.getId(),
                                analysis.getResume().getId(),
                                analysis.getSummary(),
                                analysis.getSkills(),
                                analysis.getExperience(),
                                analysis.getStrengths(),
                                analysis.getMissingSkills(),
                                analysis.getSuggestions(),
                                analysis.getAnalyzedAt()
                        ))
                        .toList();

        return ResponseEntity.ok(responses);
    }
}