package com.dld.chess.service;

import com.dld.chess.dto.MoveDTO;
import com.dld.chess.model.Game;
import com.dld.chess.model.Square;
import com.dld.chess.model.pawns.Knight;
import com.dld.chess.model.pawns.Pawn;
import com.dld.chess.model.pawns.PawnAbstract;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

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
        assertTrue(game.isActive());
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

        assertEquals(squareTo.getPawn().getName(), moveDTO.getPawnName());
        assertFalse(squareTo.isEmpty());
    }


    @Test
    void updateGameSquare_whenGivenNewSquare_shouldReturnCorrect() {
        Square squareNew = new Square("a8", new Knight("white"));
        gameService.updateGameSquare(squareNew);

        Square checkSquare = gameService.getSquare("a8");
        assertEquals("a8", checkSquare.getName());
        assertEquals("knight", checkSquare.getPawn().getName());
        assertEquals("white", checkSquare.getPawn().getColor());
    }


    @Test
    void checkIfPawnReachedEndBoard_whenWhitePawnReachEnd_shouldReturnCorrect() {
        MoveDTO mockMoveDTO = new MoveDTO();
        mockMoveDTO.setMoveFrom("a7");
        mockMoveDTO.setMoveTo("a8");
        mockMoveDTO.setPawnName("pawn");
        mockMoveDTO.setPawnColor("white");

        assertTrue(gameService.checkIfPawnReachedEndBoard(mockMoveDTO));
        assertEquals("queen", gameService.getSquare("a8").getPawn().getName());
        assertEquals("white", gameService.getSquare("a8").getPawn().getColor());
    }


    @Test
    void checkIfPawnReachedEndBoard_whenBlackPawnReachEnd_shouldReturnCorrect() {
        MoveDTO mockMoveDTO = new MoveDTO();
        mockMoveDTO.setMoveFrom("a2");
        mockMoveDTO.setMoveTo("a1");
        mockMoveDTO.setPawnName("pawn");
        mockMoveDTO.setPawnColor("black");

        assertTrue(gameService.checkIfPawnReachedEndBoard(mockMoveDTO));
        assertEquals("queen", gameService.getSquare("a1").getPawn().getName());
        assertEquals("black", gameService.getSquare("a1").getPawn().getColor());
    }
}