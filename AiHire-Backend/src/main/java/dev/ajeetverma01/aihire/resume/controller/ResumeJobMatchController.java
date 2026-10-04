package dev.ajeetverma01.aihire.resume.controller;

import dev.ajeetverma01.aihire.resume.dto.ResumeJobMatchApiResponse;
import dev.ajeetverma01.aihire.resume.entity.ResumeJobMatch;
import dev.ajeetverma01.aihire.resume.service.ResumeJobMatchService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/resumes")
public class ResumeJobMatchController {

    private final ResumeJobMatchService resumeJobMatchService;

    public ResumeJobMatchController(
            ResumeJobMatchService resumeJobMatchService
    ) {
        this.resumeJobMatchService = resumeJobMatchService;
    }

    @PostMapping("/{resumeId}/match/{jobId}")
    public ResponseEntity<ResumeJobMatchApiResponse> matchResumeToJob(
            @PathVariable UUID resumeId,
            @PathVariable UUID jobId,
            Authentication authentication
    ) {

        ResumeJobMatch match =
                resumeJobMatchService.matchResumeToJob(
                        resumeId,
                        jobId,
                        authentication.getName()
                );

        ResumeJobMatchApiResponse response =
                new ResumeJobMatchApiResponse(
                        match.getId(),
                        match.getResume().getId(),
                        match.getJob().getId(),
                        match.getJob().getTitle(),
                        match.getMatchScore(),
                        match.getOverallAssessment(),
                        match.getMatchingSkills(),
                        match.getMissingSkills(),
                        match.getMatchingExperience(),
                        match.getSkillGaps(),
                        match.getRecommendations(),
                        match.getMatchedAt()
                );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{resumeId}/match/{jobId}")
    public ResponseEntity<ResumeJobMatchApiResponse> getMyMatch(
            @PathVariable UUID resumeId,
            @PathVariable UUID jobId,
            Authentication authentication
    ) {

        ResumeJobMatch match = resumeJobMatchService.getMyMatch(
                resumeId,
                jobId,
                authentication.getName()
        );

        ResumeJobMatchApiResponse response =
                new ResumeJobMatchApiResponse(
                        match.getId(),
                        match.getResume().getId(),
                        match.getJob().getId(),
                        match.getJob().getTitle(),
                        match.getMatchScore(),
                        match.getOverallAssessment(),
                        match.getMatchingSkills(),
                        match.getMissingSkills(),
                        match.getMatchingExperience(),
                        match.getSkillGaps(),
                        match.getRecommendations(),
                        match.getMatchedAt()
                );

        return ResponseEntity.ok(response);
    }


    @GetMapping("/my-matches")
    public ResponseEntity<List<ResumeJobMatchApiResponse>> getMyMatches(
            Authentication authentication
    ) {

        List<ResumeJobMatchApiResponse> responses =
                resumeJobMatchService.getMyMatches(authentication.getName())
                        .stream()
                        .map(match -> new ResumeJobMatchApiResponse(
                                match.getId(),
                                match.getResume().getId(),
                                match.getJob().getId(),
                                match.getJob().getTitle(),
                                match.getMatchScore(),
                                match.getOverallAssessment(),
                                match.getMatchingSkills(),
                                match.getMissingSkills(),
                                match.getMatchingExperience(),
                                match.getSkillGaps(),
                                match.getRecommendations(),
                                match.getMatchedAt()
                        ))
                        .toList();

        return ResponseEntity.ok(responses);
    }
}