package com.snipit.backend.auth;

import java.time.Duration;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import lombok.Data;

@Component
@ConfigurationProperties(prefix = "auth")
@Data
public class AuthProperties {
    private Jwt jwt = new Jwt();
    private RefreshToken refreshToken = new RefreshToken();

    @Data
    public static class Jwt {
        private String secret;
        private Duration expirationTime;
        private String issuer;
    }

    @Data
    public static class RefreshToken {
        private Duration expirationTime;
    }
}
