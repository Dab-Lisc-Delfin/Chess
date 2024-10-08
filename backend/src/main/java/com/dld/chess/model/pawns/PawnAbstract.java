package com.dld.chess.model.pawns;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public abstract class PawnAbstract implements PawnInterface {
    private boolean isAlive;
    private String color;
    private String name;


    public String toString() {
        return this.getName() + " " + this.getColor();
    }
}
