package dev.ajeetverma01.aihire.resume.repository;

import dev.ajeetverma01.aihire.resume.entity.ResumeJobMatch;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ResumeJobMatchRepository
        extends JpaRepository<ResumeJobMatch, UUID> {

    Optional<ResumeJobMatch> findByResume_IdAndJob_Id(
            UUID resumeId,
            UUID jobId
    );

    List<ResumeJobMatch> findByResume_Candidate_IdOrderByMatchedAtDesc(
            UUID candidateId
    );
}