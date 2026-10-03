package dev.ajeetverma01.aihire.resume.controller;

import dev.ajeetverma01.aihire.resume.entity.Resume;
import dev.ajeetverma01.aihire.resume.service.ResumeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/candidate/resumes")
public class ResumeController {

    private final ResumeService resumeService;

    public ResumeController(ResumeService resumeService) {
        this.resumeService = resumeService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResumeResponse> uploadResume(
            @RequestParam("file") MultipartFile file,
            Authentication authentication
    ) throws Exception {

        Resume resume = resumeService.uploadResume(
                file,
                authentication.getName()
        );

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(toResponse(resume));
    }

    @GetMapping
    public ResponseEntity<List<ResumeResponse>> getMyResumes(
            Authentication authentication
    ) {
        List<ResumeResponse> resumes = resumeService
                .getMyResumes(authentication.getName())
                .stream()
                .map(this::toResponse)
                .toList();

        return ResponseEntity.ok(resumes);
    }

    private ResumeResponse toResponse(Resume resume) {
        return new ResumeResponse(
                resume.getId(),
                resume.getFileName(),
                resume.getUploadedAt()
        );
    }

    public record ResumeResponse(
            UUID id,
            String fileName,
            java.time.LocalDateTime uploadedAt
    ) {}
}