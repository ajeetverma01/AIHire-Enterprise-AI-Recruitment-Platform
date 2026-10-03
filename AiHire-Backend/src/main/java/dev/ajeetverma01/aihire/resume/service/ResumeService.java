package dev.ajeetverma01.aihire.resume.service;

import dev.ajeetverma01.aihire.entity.User;
import dev.ajeetverma01.aihire.resume.entity.Resume;
import dev.ajeetverma01.aihire.resume.repository.ResumeRepository;
import dev.ajeetverma01.aihire.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;
    private final ResumeTextExtractor resumeTextExtractor;

    public ResumeService(
            ResumeRepository resumeRepository,
            UserRepository userRepository,
            ResumeTextExtractor resumeTextExtractor
    ) {
        this.resumeRepository = resumeRepository;
        this.userRepository = userRepository;
        this.resumeTextExtractor = resumeTextExtractor;
    }

    @Transactional
    public Resume uploadResume(MultipartFile file, String candidateEmail)
            throws IOException {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Please select a PDF file.");
        }

        String originalFilename = file.getOriginalFilename();

        if (originalFilename == null ||
                !originalFilename.toLowerCase().endsWith(".pdf")) {
            throw new IllegalArgumentException("Only PDF files are allowed.");
        }

        User candidate = userRepository.findByEmail(candidateEmail)
                .orElseThrow(() ->
                        new IllegalArgumentException("Candidate not found."));

        if (candidate.getRole() == null ||
                !candidate.getRole().name().equals("CANDIDATE")) {
            throw new IllegalArgumentException(
                    "Only candidates can upload resumes.");
        }

        String extractedText = resumeTextExtractor.extractText(file);

        Resume resume = new Resume(
                candidate,
                originalFilename,
                extractedText
        );

        return resumeRepository.save(resume);
    }

    @Transactional(readOnly = true)
    public List<Resume> getMyResumes(String candidateEmail) {

        User candidate = userRepository.findByEmail(candidateEmail)
                .orElseThrow(() ->
                        new IllegalArgumentException("Candidate not found."));

        return resumeRepository
                .findByCandidate_IdOrderByUploadedAtDesc(candidate.getId());
    }
}