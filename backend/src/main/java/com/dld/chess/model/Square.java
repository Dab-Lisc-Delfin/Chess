package com.dld.chess.model;

import com.dld.chess.model.pawns.PawnInterface;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Square {

    public Square(String name) {
        this.name = name;
        this.isEmpty = true;
    }

    public Square(String name, PawnInterface pawn) {
        this.name = name;
        this.pawn = pawn;
        this.isEmpty = true;
    }

    public Square(String name, PawnInterface pawn, boolean isEmpty) {
        this.name = name;
        this.pawn = pawn;
        this.isEmpty = isEmpty;
    }

    private boolean isEmpty = true;
    private PawnInterface pawn;
    private String name;


}
