package dev.ajeetverma01.aihire.resume.entity;

import dev.ajeetverma01.aihire.entity.User;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "resumes")
public class Resume {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "candidate_id", nullable = false)
    private User candidate;

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String extractedText;

    @Column(nullable = false, updatable = false)
    private LocalDateTime uploadedAt;

    @PrePersist
    protected void onCreate() {
        uploadedAt = LocalDateTime.now();
    }

    public Resume() {
    }

    public Resume(User candidate, String fileName, String extractedText) {
        this.candidate = candidate;
        this.fileName = fileName;
        this.extractedText = extractedText;
    }

    public UUID getId() {
        return id;
    }

    public User getCandidate() {
        return candidate;
    }

    public void setCandidate(User candidate) {
        this.candidate = candidate;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getExtractedText() {
        return extractedText;
    }

    public void setExtractedText(String extractedText) {
        this.extractedText = extractedText;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }
}