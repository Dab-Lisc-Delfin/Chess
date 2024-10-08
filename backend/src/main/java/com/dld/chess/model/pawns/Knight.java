package com.dld.chess.model.pawns;

public class Knight extends PawnAbstract{

    public Knight(String color){
        this.setColor(color);
        this.setAlive(true);
        this.setName("Knight");
    }

    @Override
    public void makeMove() {
        //move in L-shape
    }
}
