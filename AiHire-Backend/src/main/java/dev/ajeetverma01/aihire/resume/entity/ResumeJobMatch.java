package dev.ajeetverma01.aihire.resume.entity;

import dev.ajeetverma01.aihire.entity.Job;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "resume_job_matches",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_resume_job_match", columnNames = {"resume_id", "job_id"})
})
public class ResumeJobMatch {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "resume_id", nullable = false)
    private Resume resume;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @Column(nullable = false)
    private int matchScore;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String overallAssessment;

    @ElementCollection
    @CollectionTable(
            name = "resume_job_matching_skills",
            joinColumns = @JoinColumn(name = "match_id")
    )
    @Column(name = "skill")
    private List<String> matchingSkills = new ArrayList<>();

    @ElementCollection
    @CollectionTable(
            name = "resume_job_missing_skills",
            joinColumns = @JoinColumn(name = "match_id")
    )
    @Column(name = "skill")
    private List<String> missingSkills = new ArrayList<>();

    @ElementCollection
    @CollectionTable(
            name = "resume_job_matching_experience",
            joinColumns = @JoinColumn(name = "match_id")
    )
    @Column(name = "experience_item")
    private List<String> matchingExperience = new ArrayList<>();

    @ElementCollection
    @CollectionTable(
            name = "resume_job_skill_gaps",
            joinColumns = @JoinColumn(name = "match_id")
    )
    @Column(name = "skill_gap")
    private List<String> skillGaps = new ArrayList<>();

    @ElementCollection
    @CollectionTable(
            name = "resume_job_recommendations",
            joinColumns = @JoinColumn(name = "match_id")
    )
    @Column(name = "recommendation")
    private List<String> recommendations = new ArrayList<>();

    @Column(nullable = false, updatable = false)
    private LocalDateTime matchedAt;

    @PrePersist
    protected void onCreate() {
        matchedAt = LocalDateTime.now();
    }

    public ResumeJobMatch() {
    }

    public ResumeJobMatch(
            Resume resume,
            Job job,
            int matchScore,
            String overallAssessment,
            List<String> matchingSkills,
            List<String> missingSkills,
            List<String> matchingExperience,
            List<String> skillGaps,
            List<String> recommendations
    ) {
        this.resume = resume;
        this.job = job;
        this.matchScore = matchScore;
        this.overallAssessment = overallAssessment;
        this.matchingSkills = matchingSkills;
        this.missingSkills = missingSkills;
        this.matchingExperience = matchingExperience;
        this.skillGaps = skillGaps;
        this.recommendations = recommendations;
    }

    public UUID getId() {
        return id;
    }

    public Resume getResume() {
        return resume;
    }

    public Job getJob() {
        return job;
    }

    public int getMatchScore() {
        return matchScore;
    }

    public String getOverallAssessment() {
        return overallAssessment;
    }

    public List<String> getMatchingSkills() {
        return matchingSkills;
    }

    public List<String> getMissingSkills() {
        return missingSkills;
    }

    public List<String> getMatchingExperience() {
        return matchingExperience;
    }

    public List<String> getSkillGaps() {
        return skillGaps;
    }

    public List<String> getRecommendations() {
        return recommendations;
    }

    public LocalDateTime getMatchedAt() {
        return matchedAt;
    }
}