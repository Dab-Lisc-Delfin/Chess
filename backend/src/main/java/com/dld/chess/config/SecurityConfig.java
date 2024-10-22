package com.dld.chess.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.bind.annotation.CrossOrigin;

@Configuration
@EnableWebSecurity
@CrossOrigin(origins = "http://localhost:4200")
public class SecurityConfig {


    private CustomAuthenticationHandler customAuthenticationHandler;
    public SecurityConfig(CustomAuthenticationHandler customAuthenticationHandler){
        this.customAuthenticationHandler = customAuthenticationHandler;
    }


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests((authz) -> authz
                        .requestMatchers("/admin/*").hasRole("ADMIN")
                        .requestMatchers("/api/create-user").permitAll()
                        .requestMatchers("/api/verify-user").authenticated()
                        .requestMatchers("/game/**").authenticated()
                        .anyRequest().authenticated())

                .csrf(csrf -> csrf.ignoringRequestMatchers("/**"))

                .formLogin(form -> form
                        .loginProcessingUrl("/login")
                        .loginPage("http://localhost:4200/login")
                        .failureUrl("http://localhost:4200/login")
                        .successHandler(customAuthenticationHandler)
                        .failureHandler(customAuthenticationHandler)
                        .permitAll());


        return http.build();
    }


//    @Bean
//    public WebSecurityCustomizer webSecurityCustomizer() {
//        return (web) -> web.ignoring()
//                .requestMatchers(new AntPathRequestMatcher("/**"));
//    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


}
