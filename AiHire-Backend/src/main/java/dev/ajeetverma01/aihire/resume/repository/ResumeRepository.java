package dev.ajeetverma01.aihire.resume.repository;

import dev.ajeetverma01.aihire.resume.entity.Resume;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ResumeRepository extends JpaRepository<Resume, UUID> {

    List<Resume> findByCandidate_IdOrderByUploadedAtDesc(UUID candidateId);
}