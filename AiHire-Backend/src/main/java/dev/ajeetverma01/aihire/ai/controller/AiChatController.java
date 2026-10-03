package dev.ajeetverma01.aihire.ai.controller;

import dev.ajeetverma01.aihire.ai.service.AiChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
public class AiChatController {

    private final AiChatService aiChatService;

    public AiChatController(AiChatService aiChatService) {
        this.aiChatService = aiChatService;
    }

    @GetMapping("/test")
    public ResponseEntity<String> testGemini() {
        return ResponseEntity.ok(aiChatService.testGemini());
    }
}
