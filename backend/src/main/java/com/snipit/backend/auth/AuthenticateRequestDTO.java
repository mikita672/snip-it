package com.snipit.backend.auth;

public class AuthenticateRequestDTO {
    private String email;
    private String password;

    public AuthenticateRequestDTO(String email, String password) {
        this.email = email;
        this.password = password;
    }
}
