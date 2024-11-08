package com.dld.chess.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Player {

    public Player(String color, String username) {
        this.color = color;
        this.username = username;
    }

    private String username;
    private String color;
}
