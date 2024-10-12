package com.dld.chess.service;

import com.dld.chess.dto.GameStatementDTO;
import com.dld.chess.dto.MoveDTO;
import com.dld.chess.dto.SquareDTO;
import com.dld.chess.model.Chessboard;
import com.dld.chess.model.Game;
import com.dld.chess.model.Square;
import com.dld.chess.model.pawns.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
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
                if (j == 0) {
                    letter = 'a';
                } else if (j == 1) {
                    letter = 'b';
                } else if (j == 2) {
                    letter = 'c';
                } else if (j == 3) {
                    letter = 'd';
                } else if (j == 4) {
                    letter = 'e';
                } else if (j == 5) {
                    letter = 'f';
                } else if (j == 6) {
                    letter = 'g';
                } else if (j == 7) {
                    letter = 'h';
                }

                if (i == 1) { //possition 2
                    squares[i][j] = new Square(letter + "" + (squares.length - i), new Pawn("black"));
                } else if (i == 6) { //possition 7
                    squares[i][j] = new Square(letter + "" + (squares.length - i), new Pawn("white"));
                } else {
                    squares[i][j] = new Square(letter + "" + (squares.length - i));
                }
            }
        }

        //put Rooks TODO - separate method
        squares[0][0].setEmpty(false);
        squares[0][0].setPawn(new Rook("black"));
        squares[0][7].setEmpty(false);
        squares[0][7].setPawn(new Rook("black"));

        squares[7][0].setEmpty(false);
        squares[7][0].setPawn(new Rook("white"));
        squares[7][7].setEmpty(false);
        squares[7][7].setPawn(new Rook("white"));
        //////

        //put Knights TODO - separate method
        squares[0][1].setEmpty(false);
        squares[0][1].setPawn(new Knight("black"));
        squares[0][6].setEmpty(false);
        squares[0][6].setPawn(new Knight("black"));

        squares[7][1].setEmpty(false);
        squares[7][1].setPawn(new Knight("white"));
        squares[7][6].setEmpty(false);
        squares[7][6].setPawn(new Knight("white"));
        ///////

        //put Bishops TODO - separate method
        squares[0][2].setEmpty(false);
        squares[0][2].setPawn(new Bishop("black"));
        squares[0][5].setEmpty(false);
        squares[0][5].setPawn(new Bishop("black"));

        squares[7][2].setEmpty(false);
        squares[7][2].setPawn(new Bishop("white"));
        squares[7][5].setEmpty(false);
        squares[7][5].setPawn(new Bishop("white"));
        ///////

        //put Queens TODO - separate method
        squares[0][3].setEmpty(false);
        squares[0][3].setPawn(new Queen("black"));

        squares[7][3].setEmpty(false);
        squares[7][3].setPawn(new Queen("white"));
        ///////


        //put Kings TODO - separate method
        squares[0][4].setEmpty(false);
        squares[0][4].setPawn(new King("black"));

        squares[7][4].setEmpty(false);
        squares[7][4].setPawn(new King("white"));
        ///////

        chessboard.setSquares(squares);

        game.setActive(true);
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


    Square getSquare(String position) {
        Square[][] gameSquare = game.getSquares();

        for (int i = 0; i < gameSquare.length; i++) {
            for (int j = 0; j < gameSquare[i].length; j++) {
                if (gameSquare[i][j].getName().equals(position)) {
                    return gameSquare[i][j];
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

                if (!squares[i][j].isEmpty()) {
                    System.out.print(squares[i][j].getName() + "-" + squares[i][j].getPawn().toString() + " ");
                } else {
                    System.out.print(squares[i][j].getName() + " ");

                }
            }
        }
    }


    public GameStatementDTO getGameStatement() {
        GameStatementDTO gameStatementDTO = new GameStatementDTO();

        Square[][] squares = game.getSquares();
        List<SquareDTO> squareDTOS = new ArrayList<>();

        for (int i = 0; i < squares.length; i++) {
            for (int j = 0; j < squares[i].length; j++) {
                if (!squares[i][j].isEmpty()) {
//                    log.info("KTORY WYWALA NULLA: " + squares[i][j].getName());
                    SquareDTO squareDTO = new SquareDTO();
                    squareDTO.setSquare(squares[i][j].getName());
                    squareDTO.setName(squares[i][j].getPawn().getName());
                    squareDTO.setColor(squares[i][j].getPawn().getColor());

                    squareDTOS.add(squareDTO);
                }
            }
        }

        gameStatementDTO.setChessBoard(squareDTOS);
        gameStatementDTO.setGameActive(game.isActive());
        return gameStatementDTO;
    }


    public void processMove(MoveDTO moveDTO) {
        checkIfCheckMate(moveDTO);

        if (isCastling(moveDTO)) {
        } else {
            Square squareFrom = getSquare(moveDTO.getMoveFrom());
            Square squareTo = getSquare(moveDTO.getMoveTo());

            squareTo.setPawn(getPawnFromPosition(moveDTO.getMoveFrom()));
            squareTo.setEmpty(false);
            squareFrom.setPawn(null);
            squareFrom.setEmpty(true);


            Square[][] squares = game.getSquares();
            for (int i = 0; i < squares.length; i++) {
                for (int j = 0; j < squares[i].length; j++) {
                    if (squares[i][j].getName().equals(squareFrom.getName())) {
                        squares[i][j] = squareFrom;
                    } else if (squares[i][j].getName().equals(squareTo.getName())) {
                        squares[i][j] = squareTo;
                    }
                }

                game.setSquares(squares);
            }
        }
    }

    public boolean checkIfCheckMate(MoveDTO moveDTO) {
        Square squareTo = getSquare(moveDTO.getMoveTo());
        if (!squareTo.isEmpty()) {
            if (squareTo.getPawn().getName().equals("king") && !squareTo.getPawn().getColor().equals(moveDTO.getPawnColor())) {
                log.info("CHECKMATE");
                game.setActive(false);
                return true;
            }
        }
        return false;
    }


    public boolean isCastling(MoveDTO moveDTO) {
        Square squareFrom = getSquare(moveDTO.getMoveFrom());
        Square squareTo = getSquare(moveDTO.getMoveTo());

        Square a1 = getSquare("a1");
        Square b1 = getSquare("b1");
        Square c1 = getSquare("c1");
        Square d1 = getSquare("d1");
        Square e1 = getSquare("e1");


        //todo shorten it
        if ((squareFrom.equals(a1) || squareFrom.equals(e1)) && (squareTo.equals(a1) || squareTo.equals(e1))) {
            if (a1.getPawn().getName().equals("rook") && e1.getPawn().getName().equals("king")) {
                c1.setPawn(e1.getPawn()); //king
                c1.setEmpty(false);

                e1.setEmpty(true);
                e1.setPawn(null);

                d1.setPawn(b1.getPawn());
                d1.setEmpty(false);

                a1.setEmpty(true);
                a1.setPawn(null);

                updateGameSquare(c1);
                updateGameSquare(e1);
                updateGameSquare(d1);
                updateGameSquare(a1);
                return true;
            }
        }
        return false;
    }


    public void updateGameSquare(Square squareToUpdate) {
        Square[][] squares = game.getSquares();
        for (int i = 0; i < squares.length; i++) {
            for (int j = 0; j < squares[i].length; j++) {
                if (squares[i][j].getName().equals(squareToUpdate.getName())) {
                    squares[i][j] = squareToUpdate;
                }
            }
            game.setSquares(squares);
        }
    }


}
