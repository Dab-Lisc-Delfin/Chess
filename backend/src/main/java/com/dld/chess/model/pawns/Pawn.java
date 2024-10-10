package com.dld.chess.model.pawns;
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
    public void makeMove(String moveFROM, String moveTO, String name, String color) {
        //just one square
    }
}
