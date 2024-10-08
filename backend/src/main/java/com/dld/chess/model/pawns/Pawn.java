package com.dld.chess.model.pawns;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Pawn extends PawnAbstract{

    public Pawn(){
        this.setColor("---");
        this.setAlive(false);
        this.setName("---");
    }

    public Pawn(String color){
        this.setColor(color);
        this.setAlive(true);
        this.setName("Pawn");
    }

    @Override
    public void makeMove() {
        //just one square
    }

    @Override
    public String toString() {
        return this.getName() + " " + this.getColor();
    }
}
