package com.dld.chess.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Chessboard {

    private Square[][] squares = new Square[8][8];

}
