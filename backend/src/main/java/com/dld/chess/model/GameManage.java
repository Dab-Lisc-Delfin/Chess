package com.dld.chess.model;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class GameManage {
    public static GameManage instance;

    List<Game> games;
    private GameManage(){
        this.games = new ArrayList<>();
    }

    public static GameManage getInstance() {
        if (instance == null) {
            instance = new GameManage();
        }
        return instance;
    }

}
