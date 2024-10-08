package com.dld.chess.service;

import com.dld.chess.model.Chessboard;
import com.dld.chess.model.Square;
import org.springframework.stereotype.Service;

@Service
public class GameService {
    public void createNewGame() {
        Chessboard chessboard = new Chessboard();
        Square[][] squares = new Square[8][8];

        char letter = 'a';

        for (int i = 0; i < squares.length; i++) {
            for (int j = 0; j < squares[i].length; j++) {

                if (i == 0) {
                    letter = 'a';
                } else if (i == 1) {
                    letter = 'b';
                } else if (i == 2) {
                    letter = 'c';
                } else if (i == 3) {
                    letter = 'd';
                } else if (i == 4) {
                    letter = 'e';
                } else if (i == 5) {
                    letter = 'f';
                } else if (i == 6) {
                    letter = 'g';
                } else if (i == 7) {
                    letter = 'h';
                }

                squares[i][j] = new Square(letter + "" + (squares.length - j));
            }
        }

        chessboard.setSquares(squares);

//        prints all chessboard squares
        for (int i = 0; i < squares.length; i++) {
            System.out.println();
            for (int j = 0; j < squares[i].length; j++) {
                System.out.print(squares[i][j].getName() + " ");
            }
        }

    }
}