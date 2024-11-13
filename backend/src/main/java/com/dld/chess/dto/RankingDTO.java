package com.dld.chess.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class RankingDTO {
    private List<PlayerRankingDTO> playersRankingList;
}
