package com.dld.chess.model.pawns;

public class Queen extends PawnAbstract {

    public Queen(String color) {
        this.setColor(color);
        this.setAlive(true);
        this.setName("queen");
    }

    @Override
    public void makeMove(String moveFROM, String moveTO, String name, String color){
        //can move horizontally, vertically, diagonally
    }
}
