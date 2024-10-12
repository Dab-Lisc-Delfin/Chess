package com.dld.chess.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Component;

@Setter
@Getter
@Component
public class Game {

    Square[][] squares = new Square[8][8];
    boolean isActive = false;

}
