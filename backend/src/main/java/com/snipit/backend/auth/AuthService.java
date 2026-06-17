package com.snipit.backend.auth;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import static org.springframework.security.core.userdetails.User.builder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.snipit.backend.auth.refreshTokens.RefreshToken;
import com.snipit.backend.auth.refreshTokens.RefreshTokenRepository;
import com.snipit.backend.user.User;
import com.snipit.backend.user.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final RefreshTokenRepository refreshTokenRepository;
    private final AuthProperties authProperties;

    public AuthTokens register(String email, String password) {
        if (repository.existsByEmail(email)) {
            throw new EmailAlreadyExistsException(email);
        }

        User user = new User();
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setIsAdmin(false);
        repository.save(user);

        UserDetails userDetails = builder()
                .username(user.getEmail())
                .password(user.getPasswordHash())
                .roles(user.getIsAdmin() ? "ADMIN" : "USER")
                .build();
        Map<String, Object> extra = new HashMap<>();
        extra.put("userId", user.getId());
        extra.put("isAdmin", user.getIsAdmin());
        String accessToken = jwtService.generateToken(extra, userDetails);
        String refreshToken = issueRefreshToken(user);
        return new AuthTokens(accessToken, refreshToken);
    }

    public AuthTokens authenticate(String email, String password) {
        authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(email, password));
        User user = repository.findByEmail(email).orElseThrow();
        UserDetails userDetails = builder()
                .username(user.getEmail())
                .password(user.getPasswordHash())
                .roles(user.getIsAdmin() ? "ADMIN" : "USER")
                .build();
        Map<String, Object> extra = new HashMap<>();
        extra.put("userId", user.getId());
        extra.put("isAdmin", user.getIsAdmin());
        String accessToken = jwtService.generateToken(extra, userDetails);
        String refreshToken = issueRefreshToken(user);
        return new AuthTokens(accessToken, refreshToken);
    }

    public AuthTokens rotateRefreshToken(String rawRefreshToken) {
        String hash = hashToken(rawRefreshToken);
        RefreshToken stored = refreshTokenRepository.findByTokenHash(hash)
                .filter(t -> t.getExpiresAt().isAfter(Instant.now()))
                .orElseThrow();
        refreshTokenRepository.delete(stored);

        User user = stored.getUser();
        Map<String, Object> extra = new HashMap<>();
        extra.put("userId", user.getId());
        extra.put("isAdmin", user.getIsAdmin());
        String newAccess = jwtService.generateToken(extra, builder()
                .username(user.getEmail())
                .password(user.getPasswordHash())
                .roles(user.getIsAdmin() ? "ADMIN" : "USER")
                .build());
        String newRefresh = issueRefreshToken(user);
        return new AuthTokens(newAccess, newRefresh);
    }

    public void revokeRefreshToken(String rawRefreshToken) {
        refreshTokenRepository.findByTokenHash(hashToken(rawRefreshToken))
                .ifPresent(refreshTokenRepository::delete);
    }

    private String issueRefreshToken(User user) {
        String raw = jwtService.generateOpaqueToken();
        RefreshToken token = new RefreshToken();
        token.setTokenHash(hashToken(raw));
        token.setExpiresAt(Instant.now().plus(authProperties.getRefreshToken().getExpirationTime()));
        token.setUser(user);
        refreshTokenRepository.save(token);
        return raw;
    }

    private String hashToken(String raw) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(raw.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(hash);
        } catch (Exception e) {
            throw new IllegalStateException("Hashing failed", e);
        }
    }

}
