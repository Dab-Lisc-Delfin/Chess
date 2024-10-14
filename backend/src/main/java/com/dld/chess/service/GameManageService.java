package com.dld.chess.service;

import com.dld.chess.dto.GameInviteDTO;
import com.dld.chess.model.Game;
import com.dld.chess.model.GameManage;
import com.dld.chess.model.Player;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class GameManageService {
    private GameManage gameManage;

    public GameManageService(GameService gameService) {
        this.gameManage = GameManage.getInstance();
    }


    public GameInviteDTO createNewGame() {
        Game game = new Game();
        GameInviteDTO gameInviteDTO = new GameInviteDTO();
        gameInviteDTO.setGameId(game.getId());
        gameInviteDTO.setLinkToInviteFriend("http://localhost:8080/join-game/" + game.getId());

        log.info("GAME CREATED: ID {}", game.getId());

        List<Game> gameList = gameManage.getGames();
        gameList.add(game);
        gameManage.setGames(gameList);

        addLoggedPlayerToGame("white", game.getId());
        log.info("Games active {}", gameList.size());
        return gameInviteDTO;
    }


    public Game getGameById(String gameId) {
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


    public void addLoggedPlayerToGame(String color, String gameId) {
        Game game = getGameById(gameId);

        String usernameLoggedUser = SecurityContextHolder.getContext().getAuthentication().getName();
        Player player = new Player(color);
        player.setUsername(usernameLoggedUser);

        List<Player> players = game.getPlayers();

        if (players.size() < 2) {
            players.add(player);
            game.setPlayers(players);
        }
//        }else{
//            throw new Exception("already 2 players in game."); TODO
//        }
    }

}