package dev.ajeetverma01.aihire.ai.service;

import dev.ajeetverma01.aihire.ai.dto.ResumeAnalysisResponse;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class ResumeAiService {

    private final ChatClient chatClient;

    public ResumeAiService(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }

    public ResumeAnalysisResponse analyzeResume(String resumeText) {

        String prompt = """
                You are an AI recruitment assistant for AIHire.

                Analyze the candidate's resume provided below.

                Extract and evaluate:
                - A concise professional summary
                - Technical and professional skills
                - Relevant experience
                - Candidate strengths
                - Important skills that appear to be missing
                - Practical suggestions for improving the resume

                Be factual and use only information present in the resume.
                Do not invent experience, skills, qualifications, or achievements.

                Resume:
                %s
                """.formatted(resumeText);

        return chatClient.prompt()
                .user(prompt)
                .call()
                .entity(ResumeAnalysisResponse.class);
    }
}