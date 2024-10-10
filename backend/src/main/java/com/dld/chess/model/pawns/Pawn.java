package com.dld.chess.model.pawns;
public class Pawn extends PawnAbstract{
    public Pawn(String color){
        this.setColor(color);
        this.setAlive(true);
        this.setName("pawn");
    }

    @Override
    public void makeMove(String moveFROM, String moveTO, String name, String color) {
        //just one square
    }
}
