package com.dld.chess.dto;

import com.dld.chess.model.Move;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class GameStatementDTO {
    private List<SquareDTO> chessBoard;
    private boolean isGameActive;
    private String gameId;
    private String playerTour = "white";
    private List<Move> gameHistory;
    private boolean isWaiting;
}
