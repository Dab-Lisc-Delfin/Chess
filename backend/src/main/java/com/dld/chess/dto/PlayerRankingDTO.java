package com.dld.chess.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlayerRankingDTO {
    public PlayerRankingDTO(String nickname, int points) {
        this.nickname = nickname;
        this.points = points;
    }

    private String nickname;
    private int points;
}
