package com.dld.chess.controller;

import com.dld.chess.dto.GameStatementDTO;
import com.dld.chess.service.GameService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
@Slf4j
public class GameController {

    GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @PostMapping("/api/start-game")
    public ResponseEntity<GameStatementDTO> startGame(){
        gameService.createNewGame();
        GameStatementDTO gameStatementDTO = gameService.getGameStatement();
        log.info("gameStatementDTO -> {}", gameStatementDTO.getChessBoard());

        return ResponseEntity.ok(gameStatementDTO);
    }


//TODO

//    @PostMapping("/api/make-move")
//    public ResponseEntity<GameStatementDTO> makeMove() {
//        GameStatementDTO gameStatementDTO = new GameStatementDTO();
//        gameStatementDTO.setChessBoard(gameService.getGameSquares());
//
//        return ResponseEntity.ok(gameStatementDTO);
//    }

}
