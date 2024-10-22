package com.dld.chess.service;

import com.dld.chess.dto.GameStatementDTO;
import com.dld.chess.model.Game;
import com.dld.chess.model.GameManage;
import com.dld.chess.model.Player;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@Service
@Slf4j
@CrossOrigin(origins = "http://localhost:4200")
public class GameManageService {
    private static GameManage gameManage;
    private GameService gameService;

    public GameManageService(GameService gameService) {
        this.gameManage = GameManage.getInstance();
        this.gameService = gameService;
    }


    public GameStatementDTO createNewGame(HttpSession session) {
        Game game = gameService.createNewGame();

        log.info("GAME CREATED: ID {}", game.getId());

        List<Game> gameList = gameManage.getGames();
        gameList.add(game);
        gameManage.setGames(gameList);
        addLoggedPlayerToGame(game.getId(), session);
        log.info("Games active {}", gameList.size());

        return gameService.getGameStatement(game);
    }


    public static Game getGameById(String gameId) {
        for (Game game : gameManage.getGames()) {
            if (game.getId().equals(gameId)) {
                return game;
            }
        }
        return null; //todo throws exceptions "game doesnt exist"
    }


    public List<Game> getAllGames() {
        return gameManage.getGames();
    }


    public void addLoggedPlayerToGame(String gameId, HttpSession session) {
        String usernameLoggedUser = SecurityContextHolder.getContext().getAuthentication().getName();
        Game game = getGameById(gameId);
        List<Player> playerList = game.getPlayers();

        if (playerList.isEmpty()) {
            playerList.add(new Player("white", usernameLoggedUser));
            session.setAttribute("playerColor", "white");
            log.info("ADDED 1ST PLAYER");
        } else if (playerList.size() == 1) {
            playerList.add(new Player("black", usernameLoggedUser));
            session.setAttribute("playerColor", "black");
            log.info("ADDED 2ND PLAYER");
        }
//        else {
//            throw new Exception("already 2 players in game.");
//        }
        game.setPlayers(playerList);
    }

}
