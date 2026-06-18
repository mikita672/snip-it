package com.snipit.backend;

import com.snipit.backend.auth.JwtAuthFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

        private final JwtAuthFilter jwtAuthFilter;

        public SecurityConfiguration(JwtAuthFilter jwtAuthFilter) {
                this.jwtAuthFilter = jwtAuthFilter;
        }

        @Bean
        SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
                return httpSecurity
                                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                                .csrf(AbstractHttpConfigurer::disable)
                                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                                .authorizeHttpRequests(authorize -> authorize
                                                .requestMatchers(
                                                        "/actuator/health",
                                                        "/v3/api-docs/**", "/v3/api-docs.yaml",
                                                        "/swagger-ui/**", "/swagger-ui.html",
                                                        "/api/v1/auth/**",
                                                        "/api/v1/treatment/preview",
                                                        "/api/v1/employee/preview",
                                                        "/api/v1/availability", "/api/v1/availability/**")
                                                .permitAll()
                                                .requestMatchers(HttpMethod.GET,   "/api/v1/reservation/my-appointments").authenticated()
                                                .requestMatchers(HttpMethod.GET,   "/api/v1/employee", "/api/v1/treatment", "/api/v1/treatment/*", "/api/v1/reservation", "/api/v1/reservation/*").hasRole("ADMIN")
                                                .requestMatchers(HttpMethod.GET,   "/api/v1/statistics/**").hasRole("ADMIN")
                                                .requestMatchers(HttpMethod.POST,  "/api/v1/employee", "/api/v1/treatment").hasRole("ADMIN")
                                                .requestMatchers(HttpMethod.PUT,   "/api/v1/employee/*", "/api/v1/treatment/*").hasRole("ADMIN")
                                                .requestMatchers(HttpMethod.PATCH, "/api/v1/employee/**", "/api/v1/treatment/**").hasRole("ADMIN")
                                                .requestMatchers(HttpMethod.PATCH, "/api/v1/reservation/*/status").hasRole("ADMIN")
                                                .anyRequest().authenticated())
                                .build();
        }

        @Bean
        CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration config = new CorsConfiguration();
                config.setAllowedOrigins(List.of("http://localhost:3000"));
                config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
                config.setAllowedHeaders(List.of("*"));
                config.setAllowCredentials(true);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", config);
                return source;
        }
}