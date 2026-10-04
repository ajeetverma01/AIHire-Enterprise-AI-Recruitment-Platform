package dev.ajeetverma01.aihire.resume.service;

import dev.ajeetverma01.aihire.ai.dto.ResumeJobMatchResponse;
import dev.ajeetverma01.aihire.ai.service.ResumeJobMatchAiService;
import dev.ajeetverma01.aihire.entity.Job;
import dev.ajeetverma01.aihire.entity.JobStatus;
import dev.ajeetverma01.aihire.entity.User;
import dev.ajeetverma01.aihire.exception.JobNotFoundException;
import dev.ajeetverma01.aihire.exception.UserNotFoundException;
import dev.ajeetverma01.aihire.repository.JobRepository;
import dev.ajeetverma01.aihire.repository.UserRepository;
import dev.ajeetverma01.aihire.resume.entity.Resume;
import dev.ajeetverma01.aihire.resume.entity.ResumeJobMatch;
import dev.ajeetverma01.aihire.resume.repository.ResumeJobMatchRepository;
import dev.ajeetverma01.aihire.resume.repository.ResumeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class ResumeJobMatchService {

    private final ResumeRepository resumeRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final ResumeJobMatchRepository matchRepository;
    private final ResumeJobMatchAiService matchAiService;

    public ResumeJobMatchService(
            ResumeRepository resumeRepository,
            JobRepository jobRepository,
            UserRepository userRepository,
            ResumeJobMatchRepository matchRepository,
            ResumeJobMatchAiService matchAiService
    ) {
        this.resumeRepository = resumeRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.matchRepository = matchRepository;
        this.matchAiService = matchAiService;
    }

    @Transactional
    public ResumeJobMatch matchResumeToJob(
            UUID resumeId,
            UUID jobId,
            String candidateEmail
    ) {

        User candidate = userRepository.findByEmail(candidateEmail)
                .orElseThrow(() ->
                        new UserNotFoundException("Candidate not found."));

        if (candidate.getRole() == null ||
                !candidate.getRole().name().equals("CANDIDATE")) {
            throw new IllegalArgumentException(
                    "Only candidates can match resumes to jobs."
            );
        }

        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Resume not found."));

        if (!resume.getCandidate().getId().equals(candidate.getId())) {
            throw new IllegalArgumentException(
                    "You are not authorized to use this resume."
            );
        }

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() ->
                        new JobNotFoundException("Job not found."));

        if (job.getStatus() != JobStatus.OPEN) {
            throw new IllegalArgumentException(
                    "Only published jobs can be matched."
            );
        }

        return matchRepository.findByResume_IdAndJob_Id(resumeId, jobId)
                .orElseGet(() -> generateAndSaveMatch(resume, job));
    }

    private ResumeJobMatch generateAndSaveMatch(
            Resume resume,
            Job job
    ) {

        ResumeJobMatchResponse aiResponse =
                matchAiService.matchResumeToJob(
                        resume.getExtractedText(),
                        job
                );

        if (aiResponse == null ||
                aiResponse.matchScore() < 0 ||
                aiResponse.matchScore() > 100) {
            throw new IllegalStateException(
                    "AI returned an invalid match score."
            );
        }

        ResumeJobMatch match = new ResumeJobMatch(
                resume,
                job,
                aiResponse.matchScore(),
                aiResponse.overallAssessment(),
                aiResponse.matchingSkills(),
                aiResponse.missingSkills(),
                aiResponse.matchingExperience(),
                aiResponse.skillGaps(),
                aiResponse.recommendations()
        );

        return matchRepository.save(match);
    }

    @Transactional(readOnly = true)
    public ResumeJobMatch getMyMatch(
            UUID resumeId,
            UUID jobId,
            String candidateEmail
    ) {

        User candidate = userRepository.findByEmail(candidateEmail)
                .orElseThrow(() ->
                        new UserNotFoundException("Candidate not found."));

        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Resume not found."));

        if (resume.getCandidate() == null ||
                !resume.getCandidate().getId().equals(candidate.getId())) {
            throw new IllegalArgumentException(
                    "You are not authorized to access this resume."
            );
        }

        return matchRepository.findByResume_IdAndJob_Id(resumeId, jobId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "No match found for this resume and job."
                        ));
    }

    @Transactional(readOnly = true)
    public List<ResumeJobMatch> getMyMatches(String candidateEmail) {

        User candidate = userRepository.findByEmail(candidateEmail)
                .orElseThrow(() ->
                        new UserNotFoundException("Candidate not found."));

        if (candidate.getRole() == null ||
                !candidate.getRole().name().equals("CANDIDATE")) {
            throw new IllegalArgumentException(
                    "Only candidates can view their resume-job matches."
            );
        }

        return matchRepository
                .findByResume_Candidate_IdOrderByMatchedAtDesc(candidate.getId());
    }
}