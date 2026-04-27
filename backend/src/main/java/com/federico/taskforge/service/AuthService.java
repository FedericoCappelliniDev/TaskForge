package com.federico.taskforge.service;

import com.federico.taskforge.domain.entity.User;
import com.federico.taskforge.dto.request.LoginRequest;
import com.federico.taskforge.dto.request.RegisterRequest;
import com.federico.taskforge.dto.response.AuthResponse;
import com.federico.taskforge.dto.response.UserResponse;
import com.federico.taskforge.exception.EmailAlreadyExistsException;
import com.federico.taskforge.repository.UserRepository;
import com.federico.taskforge.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository        userRepository;
    private final PasswordEncoder       passwordEncoder;
    private final JwtService            jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new EmailAlreadyExistsException(request.email());
        }

        User user = User.builder()
            .firstName(request.firstName())
            .lastName(request.lastName())
            .email(request.email())
            .password(passwordEncoder.encode(request.password()))
            .build();

        userRepository.save(user);

        String token = jwtService.generateToken(user);
        return AuthResponse.of(token, jwtService.getExpiration(), UserResponse.from(user));
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        User user = userRepository.findByEmail(request.email()).orElseThrow();
        String token = jwtService.generateToken(user);
        return AuthResponse.of(token, jwtService.getExpiration(), UserResponse.from(user));
    }
}
