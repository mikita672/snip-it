package com.snipit.backend.auth;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import static org.springframework.security.core.userdetails.User.builder;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.Base64;
import com.snipit.backend.auth.refreshTokens.RefreshTokenRepository;
import com.snipit.backend.user.User;
import com.snipit.backend.user.UserRepository;
import com.snipit.backend.auth.dto.AuthenticateRequestDTO;
import com.snipit.backend.auth.dto.RegisterRequestDTO;
import com.snipit.backend.auth.refreshTokens.RefreshToken;
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

    public AuthTokens register(RegisterRequestDTO request) {
        User user = new User();
        user.setEmail(request.email());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setIsAdmin(false);
        repository.save(user);

        UserDetails userDetails = builder()
                .username(user.getEmail())
                .password(user.getPasswordHash())
                .roles(user.getIsAdmin() ? "ADMIN" : "USER")
                .build();
        String accessToken = jwtService.generateToken(userDetails);
        String refreshToken = issueRefreshToken(user);
        return new AuthTokens(accessToken, refreshToken);
    }

    public AuthTokens authenticate(AuthenticateRequestDTO request) {
        authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(request.email(), request.password()));
        User user = repository.findByEmail(request.email()).orElseThrow();
        UserDetails userDetails = builder()
                .username(user.getEmail())
                .password(user.getPasswordHash())
                .roles(user.getIsAdmin() ? "ADMIN" : "USER")
                .build();
        String accessToken = jwtService.generateToken(userDetails);
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
        String newAccess = jwtService.generateToken(builder()
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
