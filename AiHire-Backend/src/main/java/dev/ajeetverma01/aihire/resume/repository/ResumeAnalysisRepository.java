package dev.ajeetverma01.aihire.resume.repository;

import dev.ajeetverma01.aihire.resume.entity.ResumeAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ResumeAnalysisRepository extends JpaRepository<ResumeAnalysis, UUID> {
    Optional<ResumeAnalysis> findByResume_Id(UUID resumeId);
    List<ResumeAnalysis> findByResume_Candidate_IdOrderByAnalyzedAtDesc(
            UUID candidateId
    );
}
