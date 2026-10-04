package dev.ajeetverma01.aihire.ai.controller;

import dev.ajeetverma01.aihire.ai.dto.ResumeAnalysisResponse;
import dev.ajeetverma01.aihire.ai.service.AiChatService;
import dev.ajeetverma01.aihire.ai.service.ResumeAiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AiChatController {

    private final AiChatService aiChatService;
    private final ResumeAiService resumeAiService;

    public AiChatController(
            AiChatService aiChatService,
            ResumeAiService resumeAiService
    ) {
        this.aiChatService = aiChatService;
        this.resumeAiService = resumeAiService;
    }

    @GetMapping("/test")
    public ResponseEntity<String> testGemini() {
        return ResponseEntity.ok(aiChatService.testGemini());
    }

    @PostMapping("/analyze-resume")
    public ResponseEntity<ResumeAnalysisResponse> analyzeResume(
            @RequestBody String resumeText
    ) {
        return ResponseEntity.ok(
                resumeAiService.analyzeResume(resumeText)
        );
    }
}
