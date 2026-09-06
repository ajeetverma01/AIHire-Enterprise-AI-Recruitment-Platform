package dev.ajeetverma01.aihire.dto;

public record LoginResponse(
        String accessToken,
        String refreshToken,
        String tokenType,
        String email,
        String role
) {
}