package com.dld.chess.model.pawns;

public class Knight extends PawnAbstract{

    public Knight(String color){
        this.setColor(color);
        this.setAlive(true);
        this.setName("knight");
    }

    @Override
    public void makeMove(String moveFROM, String moveTO, String name, String color){
        //move in L-shape
    }
}
