package com.dld.chess.model.pawns;

public class Rock extends PawnAbstract{

    public Rock(String color){
        this.setColor(color);
        this.setAlive(true);
        this.setName("Rock");
    }

    @Override
    public void makeMove(String moveFROM, String moveTO, String name, String color){
        //move horizontally or vertical
    }

}
