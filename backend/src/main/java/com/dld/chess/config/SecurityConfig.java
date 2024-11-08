package com.dld.chess.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private CustomAuthenticationHandler customAuthenticationHandler;

    public SecurityConfig(CustomAuthenticationHandler customAuthenticationHandler) {
        this.customAuthenticationHandler = customAuthenticationHandler;
    }


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests((authz) -> authz
                        .requestMatchers("/admin/*").hasRole("ADMIN")
                        .requestMatchers("/api/create-user").permitAll()
                        .requestMatchers("/game/create-game").authenticated()
                        .requestMatchers("/api/verify-user").authenticated()
                        .requestMatchers("/api/join-game/**").authenticated()
                        .requestMatchers("/game/**").authenticated()
                        .requestMatchers("/ws/**").permitAll()
                        .requestMatchers("/api/game-finish/{gameId}").permitAll()
                        .requestMatchers("/api/players-ranking").permitAll()
                        .requestMatchers("/api/game-finish/**").permitAll()
                        .anyRequest().authenticated()
                )

                .csrf(AbstractHttpConfigurer::disable)

                .cors(c -> c.configurationSource(corsConfigurationSource()))

                .formLogin(form -> form
                        .loginProcessingUrl("/login")
                        .loginPage("http://localhost:4200/login")
                        .failureUrl("http://localhost:4200/login")
                        .successHandler(customAuthenticationHandler)
                        .failureHandler(customAuthenticationHandler)
                        .permitAll());


        return http.build();
    }


    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:4200"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
        configuration.setAllowCredentials(true);
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With", "Accept"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }


    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
