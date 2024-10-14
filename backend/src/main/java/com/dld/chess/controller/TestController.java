package com.dld.chess.controller;

import com.dld.chess.dto.GameInviteDTO;
import com.dld.chess.model.Game;
import com.dld.chess.model.Player;
import com.dld.chess.service.GameManageService;
import com.dld.chess.service.GameService;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
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


    @PostMapping("/createGame")
    @ResponseBody
    public GameInviteDTO createNewGame() {
        return gameManageService.createNewGame();
    }


    @GetMapping("/join-game/{gameId}")
    @ResponseBody
    public String joinGame(@PathVariable String gameId, HttpSession session) {
//        session.getAttribute("user_id"); TODO
        Player player2 = new Player("black");
        gameManageService.joinGame(player2, gameId);

        return "user has joined to the game";
    }


    @GetMapping("/gameInfo/{gameId}")
    @ResponseBody
    public String printInfoAboutGame(@PathVariable String gameId) {
        Game game = gameManageService.getGameById(gameId);
        return "ID- " + game.getId() + "  playersSize- " + game.getPlayers().size() + " gameCurrentPlayerTour- " + game.getCurrentTour();
    }


//    @GetMapping("/test1")
//    @ResponseBody
//    public String testController() {
//        gameManageService.createNewGame();
//        List<Game> games = gameManageService.getAllGames();
//        for (Game game : games) {
//            log.info("game ID {} ", game.getId());
//            log.info("game PLAYERS {} ", game.getPlayers());
//        }
//        return "this is test1 controller";
//    }


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
