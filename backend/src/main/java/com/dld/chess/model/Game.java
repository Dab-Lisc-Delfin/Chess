package com.dld.chess.model;

import com.dld.chess.entity.User;
import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Setter
@Getter
@Component
public class Game {

    public Game() {
        this.id = UUID.randomUUID().toString();
    }

    private Square[][] squares = new Square[8][8];
    private String id;
    private boolean isActive = true; //TODO isFinished

    private List<Player> players = new ArrayList<>();
    private String currentTour;
    private boolean isStarted = false;

}
