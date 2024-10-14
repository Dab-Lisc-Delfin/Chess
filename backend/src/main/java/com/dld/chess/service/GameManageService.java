package com.dld.chess.service;

import com.dld.chess.dto.GameInviteDTO;
import com.dld.chess.model.Game;
import com.dld.chess.model.GameManage;
import com.dld.chess.model.Player;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class GameManageService {
    private GameManage gameManage;
    private GameService gameService;

    public GameManageService(GameService gameService) {
        this.gameManage = GameManage.getInstance();
        this.gameService = gameService;
    }


    public GameInviteDTO createNewGame() {
        List<Game> gameList = gameManage.getGames();
        Game game = new Game();

        //
        //GameService TODO add Player
        Player whitePlayer = new Player("white");
        List<Player> players = game.getPlayers();
        players.add(whitePlayer);
        game.setPlayers(players);
        //

        gameList.add(game);
        gameManage.setGames(gameList);

        GameInviteDTO gameInviteDTO = new GameInviteDTO();
        gameInviteDTO.setGameId(game.getId());
        gameInviteDTO.setLinkToInviteFriend("http://localhost:8080/join-game/" + game.getId());

        log.info("Games active {}", gameList.size());
        return gameInviteDTO;
    }




    public Game getGameById(String gameId){
        for(Game game : gameManage.getGames()){
            if(game.getId().equals(gameId)){
                return game;
            }
        }
        return null; //todo throws exceptions "game doesnt exist"
    }


    public List<Game> getAllGames(){
        return gameManage.getGames();
    }


    public void joinGame(Player player, String gameId){
        Game game = getGameById(gameId);
        //
        //GameService TODO add Player
        List<Player> players = game.getPlayers();
        players.add(player);
        game.setPlayers(players);
        //
    }

}
