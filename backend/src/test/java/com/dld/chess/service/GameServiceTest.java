package com.dld.chess.service;

import com.dld.chess.model.Game;
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
        assertTrue(game.isOn());
    }


    @Test
    void checkPosition_whenGivenCorrectAttribute_thenReturnTrue() {
        assertEquals("b2", gameService.checkPosition("b2"));
    }


    @Test
    void getPawnFromPosition_whenGivenCorrectPosition_thenReturnTrue(){
        PawnAbstract pawn1 = new Pawn("white");
        assertEquals(pawn1.getName(),gameService.getPawnFromPosition("b2").getName());
    }
}