package com.dld.chess.controller;

import com.dld.chess.dto.GameStatementDTO;
import com.dld.chess.dto.MoveDTO;
import com.dld.chess.service.GameService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Controller
@Slf4j
@CrossOrigin(origins = "http://localhost:4200")
public class GameController {

    GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @PostMapping("/api/start-game")
    public ResponseEntity<GameStatementDTO> startGame() {
        gameService.createNewGame();
        GameStatementDTO gameStatementDTO = gameService.getGameStatement();
        log.info("gameStatementDTO -> {}", gameStatementDTO.getChessBoard());

        return ResponseEntity.ok(gameStatementDTO);
    }


    @PostMapping("/api/make-move")
    public ResponseEntity<GameStatementDTO> makeMove(@RequestBody MoveDTO moveDTO) {
        gameService.processMove(moveDTO);
        return ResponseEntity.ok(gameService.getGameStatement());
    }

}
