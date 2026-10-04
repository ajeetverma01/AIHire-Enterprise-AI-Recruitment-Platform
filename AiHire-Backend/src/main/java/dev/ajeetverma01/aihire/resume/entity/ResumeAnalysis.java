package dev.ajeetverma01.aihire.resume.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "resume_analyses")
public class ResumeAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "resume_id", nullable = false, unique = true)
    private Resume resume;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String summary;

    @ElementCollection
    @CollectionTable(
            name = "resume_analysis_skills",
            joinColumns = @JoinColumn(name = "analysis_id")
    )
    @Column(name = "skill")
    private List<String> skills = new ArrayList<>();

    @ElementCollection
    @CollectionTable(
            name = "resume_analysis_experience",
            joinColumns = @JoinColumn(name = "analysis_id")
    )
    @Column(name = "experience_item")
    private List<String> experience = new ArrayList<>();

    @ElementCollection
    @CollectionTable(
            name = "resume_analysis_strengths",
            joinColumns = @JoinColumn(name = "analysis_id")
    )
    @Column(name = "strength")
    private List<String> strengths = new ArrayList<>();

    @ElementCollection
    @CollectionTable(
            name = "resume_analysis_missing_skills",
            joinColumns = @JoinColumn(name = "analysis_id")
    )
    @Column(name = "missing_skill")
    private List<String> missingSkills = new ArrayList<>();

    @ElementCollection
    @CollectionTable(
            name = "resume_analysis_suggestions",
            joinColumns = @JoinColumn(name = "analysis_id")
    )
    @Column(name = "suggestion")
    private List<String> suggestions = new ArrayList<>();

    @Column(nullable = false, updatable = false)
    private LocalDateTime analyzedAt;

    @PrePersist
    protected void onCreate() {
        analyzedAt = LocalDateTime.now();
    }

    public ResumeAnalysis() {
    }

    public ResumeAnalysis(
            Resume resume,
            String summary,
            List<String> skills,
            List<String> experience,
            List<String> strengths,
            List<String> missingSkills,
            List<String> suggestions
    ) {
        this.resume = resume;
        this.summary = summary;
        this.skills = skills;
        this.experience = experience;
        this.strengths = strengths;
        this.missingSkills = missingSkills;
        this.suggestions = suggestions;
    }

    public UUID getId() {
        return id;
    }

    public Resume getResume() {
        return resume;
    }

    public String getSummary() {
        return summary;
    }

    public List<String> getSkills() {
        return skills;
    }

    public List<String> getExperience() {
        return experience;
    }

    public List<String> getStrengths() {
        return strengths;
    }

    public List<String> getMissingSkills() {
        return missingSkills;
    }

    public List<String> getSuggestions() {
        return suggestions;
    }

    public LocalDateTime getAnalyzedAt() {
        return analyzedAt;
    }
}