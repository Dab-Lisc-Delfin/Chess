package com.dld.chess.model.pawns;

public class Rook extends PawnAbstract{

    public Rook(String color){
        this.setColor(color);
        this.setAlive(true);
        this.setName("rook");
    }

    @Override
    public void makeMove(String moveFROM, String moveTO, String name, String color){
        //move horizontally or vertical
    }

}
