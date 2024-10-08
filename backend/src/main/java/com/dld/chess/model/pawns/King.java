package com.dld.chess.model.pawns;

public class King extends PawnAbstract{

    public King(String color) {
        this.setColor(color);
        this.setAlive(true);
        this.setName("King");
    }
    @Override
    public void makeMove() {
        //one square in any direction
    }
}
