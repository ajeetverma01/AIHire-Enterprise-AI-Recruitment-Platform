package dev.ajeetverma01.aihire.ai.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class AiChatService {

    private final ChatClient chatClient;

    public AiChatService(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }

    public String testGemini() {
        String response = chatClient.prompt()
                .system("""
                    You are the AI assistant for AIHire,
                    an AI-powered recruitment platform.
                    Be friendly, professional, and concise.
                    """)
                .user("Introduce yourself with a short greeting.")
                .call()
                .content();

        if (response == null || response.isBlank()) {
            throw new IllegalStateException(
                    "Gemini returned an empty response."
            );
        }

        return response.trim();
    }
}
