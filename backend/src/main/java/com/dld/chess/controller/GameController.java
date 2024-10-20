package com.dld.chess.controller;

import com.dld.chess.dto.GameStatementDTO;
import com.dld.chess.dto.MoveDTO;
import com.dld.chess.model.Game;
import com.dld.chess.service.GameManageService;
import com.dld.chess.service.GameService;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@CrossOrigin(origins = "http://localhost:4200")
@Slf4j
public class GameController {
    private final GameManageService gameManageService;
    private final GameService gameService;
    private final SimpMessagingTemplate simpMessagingTemplate;

    public GameController(GameManageService gameManageService, GameService gameService, SimpMessagingTemplate simpMessagingTemplate) {
        this.gameManageService = gameManageService;
        this.simpMessagingTemplate = simpMessagingTemplate;
        this.gameService = gameService;
    }


    @PostMapping("/game/create-game")
    public ResponseEntity<GameStatementDTO> createNewGame(HttpSession session) {
        session.setAttribute("playerColor", "white");
        return ResponseEntity.ok(gameManageService.createNewGame());
    }
    //there starts white, we take gameId from DTO and connecting it with @MessageMapping("/ws/subscribe/game/{gameId}")


    @PostMapping("/join-game/{gameId}")
    public ResponseEntity<String> joinGame(@PathVariable String gameId, HttpSession session) {
        session.setAttribute("playerColor", "black");
        gameManageService.addLoggedPlayerToGame("black", gameId);
        gameService.startGameIf2PlayersJoined(gameId);

        return ResponseEntity.ok("User has joined to the game");
    }
    //sub  @MessageMapping("/ws/update-game/{gameId}")


    //ws
    @PostMapping("/update-game/{gameId}")
    public ResponseEntity<Void> updateGame(@PathVariable String gameId, @RequestBody MoveDTO moveDTO) {
        System.out.println("gameId: " + gameId);
        System.out.println("moveDTO: " + moveDTO);

        Game game = GameManageService.getGameById(gameId);
        System.out.println("NULL game?: " + game);

        if (game != null) {
            gameService.processMove(moveDTO, game);
            gameService.nextTour(game);
            String destination = "/game/refresh/" + gameId;
            simpMessagingTemplate.convertAndSend(destination, gameService.getGameStatement(game));
        }

        return ResponseEntity.ok().build();
    }


    @PostMapping("/game-statement/{gameId}")
    public ResponseEntity<GameStatementDTO> getGameStatement(@PathVariable String gameId) {
        Game game = GameManageService.getGameById(gameId);
        return ResponseEntity.ok(gameService.getGameStatement(game));
    }


    //TODO delete below methods
//    @GetMapping("/gameInfo/{gameId}")
//    @ResponseBody
//    public String printInfoAboutGame(@PathVariable String gameId) {
//        Game game = gameManageService.getGameById(gameId);
//        return "ID- " + game.getId() + "  playersSize- " + game.getPlayers().size() + " gameCurrentPlayerTour- " + game.getCurrentTour();
//    }


    @GetMapping("/allGames")
    public int getAllGames() {
        return gameManageService.getAllGames().size();
    }

}
