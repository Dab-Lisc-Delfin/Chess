package com.dld.chess.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{
//        http
//                .authorizeHttpRequests((authz) -> authz
//                        .requestMatchers("/admin/*").hasRole("ADMIN")
//                        .requestMatchers("/api/*").permitAll()
//                        .anyRequest().permitAll()
//                );
//
//        http.formLogin(Customizer.withDefaults());
//        return http.build();
//    }


    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return (web) -> web.ignoring()
                .requestMatchers(new AntPathRequestMatcher("/**"));
    }


}
