package com.snipit.backend;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {
        @Bean
        SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) {
                return httpSecurity
                                .csrf(AbstractHttpConfigurer::disable)
                                .authorizeHttpRequests((authorize) -> authorize
                                                .requestMatchers(
                                                                "/actuator/health",
                                                                "/v3/api-docs/**",
                                                                "/v3/api-docs.yaml",
                                                                "/swagger-ui/**",
                                                                "/swagger-ui.html",
                                                                "/api/v1/auth/**",
                                                                "/api/v1/treatment/preview",
                                                                "/api/v1/employee/preview")
                                                .permitAll()
                                                .anyRequest().authenticated())
                                .build();
        }
}