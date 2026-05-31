package com.snipit.backend.auth;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import static org.springframework.security.core.userdetails.User.builder;

import com.snipit.backend.user.User;
import com.snipit.backend.user.UserRepository;

@Service
public class AuthService {
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository repository, PasswordEncoder passwordEncoder, JwtService jwtService,
            AuthenticationManager authenticationManager) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    public String register(RegisterRequestDTO request) {
        User user = new User();
        user.setEmail(request.email());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setIsAdmin(false);
        repository.save(user);

        UserDetails userDetails = builder()
                .username(user.getEmail())
                .password(user.getPasswordHash())
                .roles(Boolean.TRUE.equals(user.getIsAdmin()) ? "ADMIN" : "USER")
                .build();
        return jwtService.generateToken(userDetails);
    }

    public String authenticate(AuthenticateRequestDTO request) {
        authenticationManager
            .authenticate(new UsernamePasswordAuthenticationToken(request.email(), request.password()));
        var user = repository.findByEmail(request.email()).orElseThrow();
        UserDetails userDetails = builder()
                .username(user.getEmail())
                .password(user.getPasswordHash())
                .roles(Boolean.TRUE.equals(user.getIsAdmin()) ? "ADMIN" : "USER")
                .build();
        return jwtService.generateToken(userDetails);
    }

}
