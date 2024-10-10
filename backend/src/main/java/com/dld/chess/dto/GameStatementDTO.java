package com.dld.chess.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class GameStatementDTO {
    List<SquareDTO> chessBoard;
}
