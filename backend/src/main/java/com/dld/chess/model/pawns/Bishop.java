package com.dld.chess.model.pawns;

public class Bishop extends PawnAbstract{

    public Bishop(String color){
        this.setColor(color);
        this.setAlive(true);
        this.setName("Bishop");
    }

    @Override
    public void makeMove() {
        //move diagonally
    }
}
