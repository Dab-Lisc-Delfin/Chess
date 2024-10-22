package com.dld.chess.controller;

import com.dld.chess.dto.GameStatementDTO;
import com.dld.chess.dto.MoveDTO;
import com.dld.chess.model.Game;
import com.dld.chess.model.Player;
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
    public ResponseEntity<GameStatementDTO> createNewGame() {
        return ResponseEntity.ok(gameManageService.createNewGame());
    }


    @PostMapping("/api/join-game/{gameId}")
    public ResponseEntity<Void> joinGame(@PathVariable String gameId, HttpSession session) {
        Player player = gameManageService.addLoggedPlayerToGame(gameId, session);
        gameService.startGameIf2PlayersJoined(gameId);

        String destination = "/game/refresh/" + gameId;
        simpMessagingTemplate.convertAndSend(destination, player);

        return ResponseEntity.ok().build();
    }


    //ws
    @PostMapping("/update-game/{gameId}")
    public ResponseEntity<Void> updateGame(@PathVariable String gameId, @RequestBody MoveDTO moveDTO) {
        System.out.println("gameId: " + gameId);
        System.out.println("moveDTO: " + moveDTO);

        Game game = GameManageService.getGameById(gameId);
        System.out.println("NULL game?: " + game);

        if (game != null) {
            gameService.processMove(moveDTO, game);
            gameService.addMoveToGameHistory(moveDTO, game);
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
}
