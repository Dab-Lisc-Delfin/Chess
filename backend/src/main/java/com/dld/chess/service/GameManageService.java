package com.dld.chess.service;

import com.dld.chess.model.Game;
import com.dld.chess.model.GameManage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class GameManageService {
    private GameManage gameManage;

    public GameManageService() {
        this.gameManage = GameManage.getInstance();
    }

    public void addGameToGameList() {
        List<Game> gameList = gameManage.getGames();
        gameList.add(new Game());
        gameManage.setGames(gameList);
        log.info("Games active {}", gameList.size());
    }

}
