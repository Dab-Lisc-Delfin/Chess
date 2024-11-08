package com.dld.chess.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MoveDTO {
    protected String moveFrom;
    protected String moveTo;
    protected String pawnName;
    protected String pawnColor;
    protected String playerColor;

    @Override
    public String toString() {
        return "moveFrom : " + moveFrom + " moveTo : " + moveTo + " pawnName : " + pawnName + " pawnColor : " + pawnColor;
    }
}
