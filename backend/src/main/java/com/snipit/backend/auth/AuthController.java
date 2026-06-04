package com.snipit.backend.auth;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.snipit.backend.auth.dto.AuthenticateRequestDTO;
import com.snipit.backend.auth.dto.RegisterRequestDTO;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
        private static final String ACCESS_COOKIE = "access_token";
        private static final String REFRESH_COOKIE = "refresh_token";
        private final AuthService service;

        @PostMapping("/sign-up")
        public ResponseEntity<Void> register(@Valid @RequestBody RegisterRequestDTO request) {
                AuthTokens tokens = service.register(request.getEmail(), request.getPassword());
                return withAuthCookies(tokens, ResponseEntity.noContent());
        }

        @PostMapping("/sign-in")
        public ResponseEntity<Void> authenticate(@Valid @RequestBody AuthenticateRequestDTO request) {
                AuthTokens tokens = service.authenticate(request.getEmail(), request.getPassword());
                return withAuthCookies(tokens, ResponseEntity.noContent());
        }

        @PostMapping("/refresh")
        public ResponseEntity<Void> refresh(@CookieValue(name = REFRESH_COOKIE) String refreshToken) {
                AuthTokens tokens = service.rotateRefreshToken(refreshToken);
                return withAuthCookies(tokens, ResponseEntity.noContent());
        }

        @PostMapping("/logout")
        public ResponseEntity<Void> logout(@CookieValue(name = REFRESH_COOKIE, required = false) String refreshToken) {
                if (refreshToken != null) {
                        service.revokeRefreshToken(refreshToken);
                }
                return clearAuthCookies(ResponseEntity.noContent());
        }

        private ResponseEntity<Void> withAuthCookies(AuthTokens tokens, ResponseEntity.HeadersBuilder<?> builder) {
                ResponseCookie access = ResponseCookie
                                .from(ACCESS_COOKIE, tokens.accessToken())
                                .httpOnly(true)
                                .secure(false)
                                .path("/")
                                .sameSite("Strict")
                                .build();
                ResponseCookie refresh = ResponseCookie.from(REFRESH_COOKIE, tokens.refreshToken())
                                .httpOnly(true)
                                .secure(false)
                                .path("/api/v1/auth/refresh")
                                .sameSite("Strict")
                                .build();

                HttpHeaders headers = new HttpHeaders();
                headers.add(HttpHeaders.SET_COOKIE, access.toString());
                headers.add(HttpHeaders.SET_COOKIE, refresh.toString());

                return builder.headers(headers).build();
        }

        private ResponseEntity<Void> clearAuthCookies(ResponseEntity.HeadersBuilder<?> builder) {
                ResponseCookie access = ResponseCookie
                                .from(ACCESS_COOKIE, "")
                                .httpOnly(true)
                                .secure(false)
                                .path("/")
                                .sameSite("Strict")
                                .maxAge(0)
                                .build();
                ResponseCookie refresh = ResponseCookie.from(REFRESH_COOKIE, "")
                                .httpOnly(true)
                                .secure(false)
                                .path("/api/v1/auth/refresh")
                                .sameSite("Strict")
                                .maxAge(0)
                                .build();

                HttpHeaders headers = new HttpHeaders();
                headers.add(HttpHeaders.SET_COOKIE, access.toString());
                headers.add(HttpHeaders.SET_COOKIE, refresh.toString());

                return builder.headers(headers).build();
        }
}
