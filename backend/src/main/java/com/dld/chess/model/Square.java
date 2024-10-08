package com.dld.chess.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Square {

    public Square(String name) {
        this.name = name;
    }

    private boolean isEmpty;
    private PawnInterface pawn;
    private String name;


}
