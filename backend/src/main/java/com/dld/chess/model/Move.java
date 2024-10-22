package com.dld.chess.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Move {
    protected String moveFrom;
    protected String moveTo;
    protected String pawnName;
    protected String pawnColor;
}
