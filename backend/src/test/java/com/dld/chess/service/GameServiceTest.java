package com.dld.chess.service;

import com.dld.chess.dto.MoveDTO;
import com.dld.chess.model.Game;
import com.dld.chess.model.Square;
import com.dld.chess.model.pawns.Pawn;
import com.dld.chess.model.pawns.PawnAbstract;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@Slf4j
class GameServiceTest {

    private Game game;
    private GameService gameService;

    @BeforeEach
    public void setUp() {
        game = new Game();
        gameService = new GameService(game);
        gameService.createNewGame();
    }


    @Test
    void createNewGame_whenGameStarted() {
        gameService.printAllChessBoardSquares();
        assertTrue(game.isOn());
    }


    @Test
    void getSquare_whenGivenCorrectAttribute_thenReturnTrue() {
        assertEquals("b2", gameService.getSquare("b2").getName());
    }


    @Test
    void getPawnFromPosition_whenGivenCorrectPosition_thenReturnTrue() {
        PawnAbstract pawn1 = new Pawn("white");
        assertEquals(pawn1.getName(), gameService.getPawnFromPosition("b2").getName());
    }


    @Test
    void processMove() {
        MoveDTO moveDTO = new MoveDTO();
        moveDTO.setMoveFrom("b7");
        moveDTO.setMoveTo("b5");
        moveDTO.setPawnName("pawn");
        moveDTO.setPawnColor("black");

        Square squareFrom = gameService.getSquare("b7");

        //moveFrom
        assertEquals(squareFrom.getName(), moveDTO.getMoveFrom());
        assertEquals(squareFrom.getPawn().getName(), moveDTO.getPawnName());
        assertEquals(squareFrom.getPawn().getColor(), moveDTO.getPawnColor());

        gameService.processMove(moveDTO);
        assertTrue(gameService.getSquare("b7").isEmpty());

        //moveTo
        Square squareTo = gameService.getSquare("b5");

        System.out.println("sososo " + squareTo.getName() + moveDTO.getMoveTo());
        assertEquals(squareTo.getPawn().getName(), moveDTO.getPawnName());
        assertFalse(squareTo.isEmpty());
    }
}