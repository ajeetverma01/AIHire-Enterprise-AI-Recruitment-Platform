package dev.ajeetverma01.aihire.service;

import dev.ajeetverma01.aihire.dto.AuthResponse;
import dev.ajeetverma01.aihire.dto.RegisterRequest;
import dev.ajeetverma01.aihire.entity.Role;
import dev.ajeetverma01.aihire.entity.User;
import dev.ajeetverma01.aihire.exception.DuplicateResourceException;
import dev.ajeetverma01.aihire.exception.InvalidCredentialsException;
import dev.ajeetverma01.aihire.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import dev.ajeetverma01.aihire.dto.LoginRequest;
import dev.ajeetverma01.aihire.dto.LoginResponse;
import dev.ajeetverma01.aihire.security.JwtService;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }


    public AuthResponse register(RegisterRequest request) {

        // 1. Check whether email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email is already registered");
        }

        // 2. Create user
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.RECRUITER)
                .build();

        // 3. Save user
        userRepository.save(user);

        // 4. Return response
        return new AuthResponse("User registered successfully");
    }



    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() ->
                        new InvalidCredentialsException("Invalid email or password")
                );

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        String accessToken = jwtService.generateAccessToken(
                user.getEmail(),
                user.getRole().name()
        );

        String refreshToken = jwtService.generateRefreshToken(
                user.getEmail()
        );

        return new LoginResponse(
                accessToken,
                refreshToken,
                "Bearer",
                user.getEmail(),
                user.getRole().name()
        );
    }
}