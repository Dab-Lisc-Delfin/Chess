package com.dld.chess.model.pawns;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public abstract class PawnAbstract {
    protected boolean isAlive;
    protected String color;
    protected String name;

    public abstract void makeMove(String moveFROM, String moveTO, String name, String color);


    public String toString() {
        return this.getName() + " " + this.getColor();
    }

}
