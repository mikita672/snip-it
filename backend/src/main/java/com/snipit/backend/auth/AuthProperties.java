package com.snipit.backend.auth;

import java.time.Duration;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "auth")
public class AuthProperties {
    private Jwt jwt = new Jwt();
    private RefreshToken refreshToken = new RefreshToken();

    public Jwt getJwt() {
        return jwt;
    }

    public void setJwt(Jwt jwt) {
        this.jwt = jwt;
    }

    public RefreshToken getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(RefreshToken refreshToken) {
        this.refreshToken = refreshToken;
    }

    public static class Jwt {
        private String secret;
        private Duration expirationTime;
        private String issuer;

        public String getSecret() {
            return secret;
        }

        public void setSecret(String secret) {
            this.secret = secret;
        }

        public Duration getExpirationTime() {
            return expirationTime;
        }

        public void setExpirationTime(Duration expirationTime) {
            this.expirationTime = expirationTime;
        }

        public String getIssuer() {
            return issuer;
        }

        public void setIssuer(String issuer) {
            this.issuer = issuer;
        }
    }

    public static class RefreshToken {
        private Duration expirationTime;

        public Duration getExpirationTime() {
            return expirationTime;
        }

        public void setExpirationTime(Duration expirationTime) {
            this.expirationTime = expirationTime;
        }
    }
}
