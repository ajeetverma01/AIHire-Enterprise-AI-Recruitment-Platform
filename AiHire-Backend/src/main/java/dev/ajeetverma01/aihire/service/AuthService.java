package dev.ajeetverma01.aihire.service;

import dev.ajeetverma01.aihire.dto.AuthResponse;
import dev.ajeetverma01.aihire.dto.RegisterRequest;
import dev.ajeetverma01.aihire.entity.Role;
import dev.ajeetverma01.aihire.entity.User;
import dev.ajeetverma01.aihire.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse register(RegisterRequest request) {

        // 1. Check whether email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered");
        }

        // 2. Create user
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.CANDIDATE)
                .build();

        // 3. Save user
        userRepository.save(user);

        // 4. Return response
        return new AuthResponse("User registered successfully");
    }
}