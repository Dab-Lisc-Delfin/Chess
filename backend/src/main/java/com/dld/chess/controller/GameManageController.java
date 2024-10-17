package com.dld.chess.controller;

import com.dld.chess.dto.GameInviteDTO;
import com.dld.chess.model.Game;
import com.dld.chess.service.GameManageService;
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
    private final SimpMessagingTemplate simpMessagingTemplate;

    public GameManageController(GameManageService gameManageService, SimpMessagingTemplate simpMessagingTemplate) {
        this.gameManageService = gameManageService;
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    //PostMapping later TODO
    @GetMapping("/api/createGame")
    @ResponseBody
    public ResponseEntity<GameInviteDTO> createNewGame() {
        return ResponseEntity.ok(gameManageService.createNewGame());
    }


    //ws
    @MessageMapping("/ws/subscribe/game/{gameId}")
    public void updateGame(@DestinationVariable String gameId) {
        //session get user
        //process Move
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


    @GetMapping("/gameInfo/{gameId}")
    @ResponseBody
    public String printInfoAboutGame(@PathVariable String gameId) {
        Game game = gameManageService.getGameById(gameId);
        return "ID- " + game.getId() + "  playersSize- " + game.getPlayers().size() + " gameCurrentPlayerTour- " + game.getCurrentTour();
    }


    @GetMapping("/allGames")
    public int getAllGames() {
        return gameManageService.getAllGames().size();
    }

}
