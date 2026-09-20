package dev.ajeetverma01.aihire.repository;

import dev.ajeetverma01.aihire.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ApplicationRepository extends JpaRepository<Application, UUID> {
    boolean existsByJobIdAndCandidateId(
            UUID jobId,
            UUID candidateId
    );
    List<Application> findByCandidateId(UUID candidateId);
}