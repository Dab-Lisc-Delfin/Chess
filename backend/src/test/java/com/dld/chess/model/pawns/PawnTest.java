package com.dld.chess.model.pawns;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class PawnTest {

    @Test
    void makeMove() {
        Pawn pawn = new Pawn("black");
        pawn.makeMove("h1","c1","black","pawn");

//        String checkPossition;


    }
}