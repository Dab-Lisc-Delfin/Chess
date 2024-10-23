package com.dld.chess.controller;

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
public class TestController {
    GameService chessboardService;
    GameManageService gameManageService;

    public TestController(GameService chessboardService, GameManageService gameManageService) {
        this.chessboardService = chessboardService;
        this.gameManageService = gameManageService;
    }


    @GetMapping("/current-user")
    @ResponseBody
    public ResponseEntity<UserDetails> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.isAuthenticated()) {
            // Pobierz szczegóły użytkownika
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


    @PostMapping("/api/home")
    public ResponseEntity<String> getHomeJSON() {
        System.out.println("JSON was called");

        String output = """
                    {
                    "chessBoard": [
                  [
                    {
                        "square":"a8", "name":"rook", "color":"black"
                    },
                    {
                        "square":"b8", "name":"knight", "color":"black"
                    },
                    {
                        "square":"c8", "name":"bishop", "color":"black"
                    },
                    {
                        "square":"d8", "name":"queen", "color":"black"
                    },
                    {
                        "square":"e8", "name":"king", "color":"black"
                    },
                    {
                        "square":"f8", "name":"bishop", "color":"black"
                    },
                    {
                        "square":"g8", "name":"knight", "color":"black"
                    },
                    {
                        "square":"h8", "name":"rook", "color":"black"
                    }
                  ],
                  [
                    {
                        "square":"a7", "name":"pawn", "color":"black"
                    },
                    {
                        "square":"b7", "name":"pawn", "color":"black"
                    },
                    {
                        "square":"c7", "name":"pawn", "color":"black"
                    },
                    {
                        "square":"d7", "name":"pawn", "color":"black"
                    },
                    {
                        "square":"e7", "name":"pawn", "color":"black"
                    },
                    {
                        "square":"f7", "name":"pawn", "color":"black"
                    },
                    {
                        "square":"g7", "name":"pawn", "color":"black"
                    },
                    {
                        "square":"h7", "name":"pawn", "color":"black"
                    }
                  ],
                  [
                    {
                        "square":"a2", "name":"pawn", "color":"white"
                    },
                    {
                        "square":"b2", "name":"pawn", "color":"white"
                    },
                    {
                        "square":"c2", "name":"pawn", "color":"white"
                    },
                    {
                        "square":"d2", "name":"pawn", "color":"white"
                    },
                    {
                        "square":"e2", "name":"pawn", "color":"white"
                    },
                    {
                        "square":"f2", "name":"pawn", "color":"white"
                    },
                    {
                        "square":"g2", "name":"pawn", "color":"white"
                    },
                    {
                        "square":"h2", "name":"pawn", "color":"white"
                    }
                  ],
                  [
                    {
                        "square":"a1", "name":"rook", "color":"white"
                    },
                    {
                        "square":"b1", "name":"knight", "color":"white"
                    },
                    {
                        "square":"c1", "name":"bishop", "color":"white"
                    },
                    {
                        "square":"d1", "name":"queen", "color":"white"
                    },
                    {
                        "square":"e1", "name":"king", "color":"white"
                    },
                    {
                        "square":"f1", "name":"bishop", "color":"white"
                    },
                    {
                        "square":"g1", "name":"knight", "color":"white"
                    },
                    {
                        "square":"h1", "name":"rook", "color":"white"
                    }
                  ]
                ]
                }
                """;

        return ResponseEntity.ok(output);
    }

}
