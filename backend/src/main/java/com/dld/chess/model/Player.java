package com.dld.chess.model;

import lombok.Getter;
import lombok.Setter;

//new
@Getter
@Setter
public class Player {

    public Player(String color){
        this.color = color;
    }

    int playerId;
    String color;
}
