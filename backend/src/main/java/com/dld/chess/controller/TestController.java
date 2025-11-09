package com.dld.chess.controller;

import com.dld.chess.repository.UserRepository;
import com.dld.chess.service.GameManageService;
import com.dld.chess.service.GameService;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;


@Controller
@Slf4j
@CrossOrigin(origins = "http://localhost:4200")
public class TestController {
    GameService chessboardService;
    GameManageService gameManageService;
    UserRepository userRepository;

    public TestController(GameService chessboardService, GameManageService gameManageService, UserRepository userRepository) {
        this.chessboardService = chessboardService;
        this.gameManageService = gameManageService;
        this.userRepository = userRepository;
    }


    @GetMapping("/current-user")
    @ResponseBody
    public ResponseEntity<UserDetails> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.isAuthenticated()) {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            log.info("LOGG username {}, password {}", userDetails.getUsername(), userDetails.getPassword());
            return ResponseEntity.ok(userDetails);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }


    @GetMapping("/sessionCheck")
    @ResponseBody
    public String getUsernameFromSession(HttpSession httpSession) {
        String color = (String) httpSession.getAttribute("playerColor");
        log.info("USERNAME FROM SESSION: {} ", color);
        return color;
    }
}
