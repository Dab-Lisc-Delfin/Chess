package com.dld.chess.model;

import com.dld.chess.entity.User;
import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Component;

import java.util.List;

@Setter
@Getter
@Component
public class Game {
    Square[][] squares = new Square[8][8];
    boolean isActive = false;

    List<User> players;
    String currentTour;

}
