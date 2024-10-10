package com.dld.chess.service;

import com.dld.chess.model.Chessboard;
import com.dld.chess.model.Game;
import com.dld.chess.model.Square;
import com.dld.chess.model.pawns.*;
import org.springframework.stereotype.Service;

@Service
public class GameService {
    private Game game;

    public GameService(Game game) {
        this.game = game;
    }

    public void createNewGame() {
        Chessboard chessboard = new Chessboard();
        Square[][] squares = new Square[8][8];

        char letter = 'a';

        for (int i = 0; i < squares.length; i++) {
            for (int j = 0; j < squares[i].length; j++) {

                //TODO shorten it
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

                if (i == 1) { //possition 2
                    squares[i][j] = new Square(letter + "" + (squares.length - j), new Pawn("black"), false);
                } else if (i == 6) { //possition 7
                    squares[i][j] = new Square(letter + "" + (squares.length - j), new Pawn("white"), false);
                } else {
                    squares[i][j] = new Square(letter + "" + (squares.length - j), new Pawn());
                }
            }
        }

        //put Rocks TODO - separate method
        squares[0][0].setPawn(new Rock("black"));
        squares[0][7].setPawn(new Rock("black"));

        squares[7][0].setPawn(new Rock("white"));
        squares[7][7].setPawn(new Rock("white"));
        //////

        //put Knights TODO - separate method
        squares[0][1].setPawn(new Knight("black"));
        squares[0][6].setPawn(new Knight("black"));

        squares[7][1].setPawn(new Knight("white"));
        squares[7][6].setPawn(new Knight("white"));
        ///////

        //put Bishops TODO - separate method
        squares[0][2].setPawn(new Bishop("black"));
        squares[0][5].setPawn(new Bishop("black"));

        squares[7][2].setPawn(new Bishop("white"));
        squares[7][5].setPawn(new Bishop("white"));
        ///////

        //put Queens TODO - separate method
        squares[0][3].setPawn(new Queen("black"));

        squares[7][3].setPawn(new Queen("white"));
        ///////


        //put Kings TODO - separate method
        squares[0][4].setPawn(new King("black"));

        squares[7][4].setPawn(new King("white"));
        ///////

        chessboard.setSquares(squares);

        game.setOn(true);
        game.setSquares(squares);
    }


    PawnAbstract getPawnFromPosition(String position) {
        Square[][] gameSquare = game.getSquares();

        for (int i = 0; i < gameSquare.length; i++) {
            for (int j = 0; j < gameSquare[i].length; j++) {
                if (gameSquare[i][j].getName().equals(position)) {
                    return gameSquare[i][j].getPawn();
                }
            }
        }
        return null;
    }


    String checkPosition(String position) {
        Square[][] gameSquare = game.getSquares();

        for (int i = 0; i < gameSquare.length; i++) {
            for (int j = 0; j < gameSquare[i].length; j++) {
                if (gameSquare[i][j].getName().equals(position)) {
                    return gameSquare[i][j].getName();
                }
            }
        }
        return null;
    }


    public void printAllChessBoardSquares() {
        Square[][] squares = game.getSquares();
        for (int i = 0; i < squares.length; i++) {
            System.out.println();
            for (int j = 0; j < squares[i].length; j++) {
                System.out.print(squares[i][j].getName() + "-" + squares[i][j].getPawn().toString() + " ");
            }
        }
    }

}
