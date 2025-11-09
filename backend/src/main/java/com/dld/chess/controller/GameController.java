package com.dld.chess.controller;

import com.dld.chess.dto.ColorDTO;
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
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@Slf4j
@CrossOrigin(origins = "http://localhost:4200")
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
    public ResponseEntity<GameStatementDTO> createNewGame(Authentication authentication) {
        GameStatementDTO gameStatementDTO = gameManageService.createNewGame();

        String destination = "/game/refresh/" + gameStatementDTO.getGameId();
        simpMessagingTemplate.convertAndSend(destination, gameStatementDTO);


        return ResponseEntity.ok(gameStatementDTO);

    }


    @PostMapping("/api/join-game/{gameId}")
    public ResponseEntity<Player> joinGame(@PathVariable String gameId, HttpSession session) {
        Player player = gameManageService.addLoggedPlayerToGame(gameId, session);
        gameService.startGameIf2PlayersJoined(gameId);
        Game game = GameManageService.getGameById(gameId);

        if (game != null) {
            String destination = "/game/refresh/" + gameId;
            simpMessagingTemplate.convertAndSend(destination, gameService.getGameStatement(game));
        }

        return ResponseEntity.ok(player);
    }


    @PostMapping("/game-statement/{gameId}")
    public ResponseEntity<GameStatementDTO> getGameStatement(@PathVariable String gameId) {
        Game game = GameManageService.getGameById(gameId);
        return ResponseEntity.ok(gameService.getGameStatement(game));
    }


    @PostMapping("/api/game-finish/{gameId}")
    public ResponseEntity<Void> setGameFinished(@PathVariable String gameId, @RequestBody ColorDTO colorDTO) {
        Game game = GameManageService.getGameById(gameId);
        gameService.managePlayerPoints(game, colorDTO.getColor());
        gameService.setGameWinner(game, colorDTO.getColor());
        gameService.finishGame(game);
        String destination = "/game/refresh/" + gameId;
        simpMessagingTemplate.convertAndSend(destination, gameService.getGameStatement(game));
        return ResponseEntity.ok().build();
    }


    //ws
    @PostMapping("/update-game/{gameId}")
    public ResponseEntity<Void> updateGame(@PathVariable String gameId, @RequestBody MoveDTO moveDTO) {
        Game game = GameManageService.getGameById(gameId);

        if (game != null) {
            gameService.processMove(moveDTO, game);
            gameService.addMoveToGameHistory(moveDTO, game);
            gameService.nextTour(game);
            String destination = "/game/refresh/" + gameId;
            simpMessagingTemplate.convertAndSend(destination, gameService.getGameStatement(game));
        }
        return ResponseEntity.ok().build();
    }
}
