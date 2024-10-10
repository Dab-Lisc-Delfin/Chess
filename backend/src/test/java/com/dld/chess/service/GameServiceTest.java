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


    //{
//  "mov_from": "b2",
//  "mov_to": "b4",
//  "pawnName": "pawn",
//  "pawnColor": "white"
//}
    @Test
    void processMove() {
        //musze dostac wynik z e5 rowny "pawnName": "pawn", "pawnColor": "white"
        //move from ma byc puste +sprawdzic czy tam na pewno byl "pawnName": "pawn", "pawnColor": "white" przed czyszczeniem

        Map<String, String> mockMoveDTO = new HashMap<>();
        mockMoveDTO.put("moveFrom", "b2");
        mockMoveDTO.put("moveTo", "b4");
        mockMoveDTO.put("pawnName", "pawn");
        mockMoveDTO.put("pawnColor", "black");

        Square squareFrom = gameService.getSquare("b2");

        assertEquals(squareFrom.getName(), mockMoveDTO.get("moveFrom"));
        assertEquals(squareFrom.getPawn().getName(), mockMoveDTO.get("pawnName"));
        assertEquals(squareFrom.getPawn().getColor(), mockMoveDTO.get("pawnColor"));
    }
}