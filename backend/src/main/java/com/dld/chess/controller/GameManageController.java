package com.dld.chess.controller;

import com.dld.chess.dto.GameInviteDTO;
import com.dld.chess.model.Game;
import com.dld.chess.model.GameManage;
import com.dld.chess.model.Player;
import com.dld.chess.service.GameManageService;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class GameManageController {
    private final GameManageService gameManageService;

    public GameManageController(GameManageService gameManageService) {
        this.gameManageService = gameManageService;
    }

    //PostMapping later TODO
    @GetMapping("/createGame")
    @ResponseBody
    public GameInviteDTO createNewGame() {
        return gameManageService.createNewGame();
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
    public int getAllGames(){
        return gameManageService.getAllGames().size();
    }

}
