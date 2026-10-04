package dev.ajeetverma01.aihire.resume.service;

import dev.ajeetverma01.aihire.ai.dto.ResumeAnalysisResponse;
import dev.ajeetverma01.aihire.ai.service.ResumeAiService;
import dev.ajeetverma01.aihire.resume.entity.Resume;
import dev.ajeetverma01.aihire.resume.entity.ResumeAnalysis;
import dev.ajeetverma01.aihire.resume.repository.ResumeAnalysisRepository;
import dev.ajeetverma01.aihire.resume.repository.ResumeRepository;
import dev.ajeetverma01.aihire.entity.User;
import dev.ajeetverma01.aihire.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class ResumeAnalysisService {

    private final ResumeRepository resumeRepository;
    private final ResumeAnalysisRepository resumeAnalysisRepository;
    private final ResumeAiService resumeAiService;
    private final UserRepository userRepository;

    public ResumeAnalysisService(
            ResumeRepository resumeRepository,
            ResumeAnalysisRepository resumeAnalysisRepository,
            ResumeAiService resumeAiService,
            UserRepository userRepository
    ) {
        this.resumeRepository = resumeRepository;
        this.resumeAnalysisRepository = resumeAnalysisRepository;
        this.resumeAiService = resumeAiService;
        this.userRepository = userRepository;
    }

    @Transactional
    public ResumeAnalysis analyzeResume(
            UUID resumeId,
            String candidateEmail
    ) {

        User candidate = userRepository.findByEmail(candidateEmail)
                .orElseThrow(() ->
                        new IllegalArgumentException("Candidate not found."));

        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Resume not found."));

        if (!resume.getCandidate().getId().equals(candidate.getId())) {
            throw new IllegalArgumentException(
                    "You are not authorized to analyze this resume."
            );
        }
        return resumeAnalysisRepository.findByResume_Id(resumeId)
                .orElseGet(() -> generateAndSaveAnalysis(resume));
    }

    private ResumeAnalysis generateAndSaveAnalysis(Resume resume) {

        ResumeAnalysisResponse aiResponse =
                resumeAiService.analyzeResume(resume.getExtractedText());

        ResumeAnalysis analysis = new ResumeAnalysis(
                resume,
                aiResponse.summary(),
                aiResponse.skills(),
                aiResponse.experience(),
                aiResponse.strengths(),
                aiResponse.missingSkills(),
                aiResponse.suggestions()
        );

        return resumeAnalysisRepository.save(analysis);
    }


    @Transactional(readOnly = true)
    public ResumeAnalysis getMyResumeAnalysis(
            UUID resumeId,
            String candidateEmail
    ) {

        User candidate = userRepository.findByEmail(candidateEmail)
                .orElseThrow(() ->
                        new IllegalArgumentException("Candidate not found."));

        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Resume not found."));

        if (!resume.getCandidate().getId().equals(candidate.getId())) {
            throw new IllegalArgumentException(
                    "You are not authorized to view this analysis."
            );
        }

        return resumeAnalysisRepository.findByResume_Id(resumeId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Analysis not found for this resume."
                        ));
    }

    @Transactional(readOnly = true)
    public List<ResumeAnalysis> getMyResumeAnalyses(String candidateEmail) {

        User candidate = userRepository.findByEmail(candidateEmail)
                .orElseThrow(() ->
                        new IllegalArgumentException("Candidate not found."));

        return resumeAnalysisRepository
                .findByResume_Candidate_IdOrderByAnalyzedAtDesc(candidate.getId());
    }
}