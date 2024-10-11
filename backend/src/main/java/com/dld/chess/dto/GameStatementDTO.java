package com.dld.chess.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class GameStatementDTO {
    private List<SquareDTO> chessBoard;
    private boolean isGameActive;
}
