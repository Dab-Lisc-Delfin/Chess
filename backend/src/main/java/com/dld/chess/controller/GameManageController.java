package com.dld.chess.controller;

import com.dld.chess.dto.GameInviteDTO;
import com.dld.chess.dto.GameStatementDTO;
import com.dld.chess.dto.MoveDTO;
import com.dld.chess.model.Game;
import com.dld.chess.service.GameManageService;
import com.dld.chess.service.GameService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class GameManageController {
    private final GameManageService gameManageService;
    private final GameService gameService;
    private final SimpMessagingTemplate simpMessagingTemplate;

    public GameManageController(GameManageService gameManageService, GameService gameService, SimpMessagingTemplate simpMessagingTemplate) {
        this.gameManageService = gameManageService;
        this.simpMessagingTemplate = simpMessagingTemplate;
        this.gameService = gameService;
    }

    //PostMapping later TODO
    @MessageMapping("/game/create-game")
    @ResponseBody
    public ResponseEntity<GameStatementDTO> createNewGame() {
        return ResponseEntity.ok(gameManageService.createNewGame());
    }

    //there starts white, we take gameId from DTO and connecting it with @MessageMapping("/ws/subscribe/game/{gameId}")


    //ws
    @MessageMapping("/ws/subscribe/game/{gameId}")
    public void updateGame(@DestinationVariable String gameId, MoveDTO moveDTO) {
        //session get user
//        gameService.processMove(moveDTO); //process Move
        //update Game Statement
        String destination = "/game/update-game/" + gameId;
        simpMessagingTemplate.convertAndSend(destination); //+gameStatement
    }


    @GetMapping("/join-game/{gameId}")
    @ResponseBody
    public String joinGame(@PathVariable String gameId) {
        gameManageService.addLoggedPlayerToGame("black", gameId);
        //if game is started send GameStatementDTO

        return "user has joined to the game";
    }


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
