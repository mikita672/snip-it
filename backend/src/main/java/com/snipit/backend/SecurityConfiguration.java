package com.snipit.backend;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.SecurityFilterChain;

import com.snipit.backend.user.UserRepository;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {
        private final UserRepository repository;

        public SecurityConfiguration(UserRepository repository) {
                this.repository = repository;
        }

        @Bean
        SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) {
                return httpSecurity
                                .csrf(AbstractHttpConfigurer::disable)
                                .authorizeHttpRequests((authorize) -> authorize
                                                .requestMatchers(
                                                                "/actuator/health")
                                                .permitAll()
                                                .anyRequest().authenticated())
                                .build();
        }

        @Bean
        public UserDetailsService userDetailsService() {
                return username -> repository.findByEmail(username)
                        .map(user -> org.springframework.security.core.userdetails.User.builder()
                                .username(user.getEmail())
                                .password(user.getPasswordHash())
                                .roles(Boolean.TRUE.equals(user.getIsAdmin()) ? "ADMIN" : "USER")
                                .build())
                        .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        }
}