package com.dld.chess.controller;

import com.dld.chess.dto.UserDTO;
import com.dld.chess.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Controller
@Slf4j
public class UserController {

    private UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/api/verify-user")
    public ResponseEntity<String> verifyUser() {
        return ResponseEntity.ok("OK");
    }



    @PostMapping("/api/create-user")
    public ResponseEntity<String> createNewUser(@RequestBody UserDTO userDTO) {
        userService.saveUser(userDTO);
        return ResponseEntity.ok("OK");
    }
}
