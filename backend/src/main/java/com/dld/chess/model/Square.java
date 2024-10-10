package com.dld.chess.model;

import com.dld.chess.model.pawns.PawnAbstract;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Square {

    private String name;
    private boolean isEmpty = true;
    private PawnAbstract pawn;


    public Square(String name) {
        this.name = name;
        this.isEmpty = true;
    }


    public Square(String name, PawnAbstract pawn) {
        this.name = name;
        this.pawn = pawn;
        this.isEmpty = true;
    }


    public Square(String name, PawnAbstract pawn, boolean isEmpty) {
        this.name = name;
        this.pawn = pawn;
        this.isEmpty = isEmpty;
    }
}
