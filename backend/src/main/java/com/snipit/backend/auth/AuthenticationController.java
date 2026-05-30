package com.snipit.backend.auth;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthenticationController {
    private final AuthenticationService service;

    public AuthenticationController(AuthenticationService service) {
        this.service = service;
    }

    @PostMapping("/sign-up")
    public ResponseEntity<AuthenticationResponse> register(@Valid @RequestBody RegisterRequestDTO request) {
        return ResponseEntity.ok(service.register(request));
    }

    @PostMapping("/sign-in")
    public ResponseEntity<AuthenticationResponse> authenticate(@Valid @RequestBody AuthenticateRequestDTO request) {
        return ResponseEntity.ok(service.authenticate(request));
    }
}
