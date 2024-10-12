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
        } else if (checkIfPawnReachedEndBoard(moveDTO)) {
        } else {
            Square squareTo = new Square(moveDTO.getMoveTo(), getSquare(moveDTO.getMoveFrom()).getPawn());
            updateGameSquare(squareTo);
            makeGameSquareEmpty(moveDTO.getMoveFrom());
        }
    }


    private void checkIfCheckMate(MoveDTO moveDTO) {
        Square squareTo = getSquare(moveDTO.getMoveTo());
        if (!squareTo.isEmpty()) {
            if (squareTo.getPawn().getName().equals("king") && !squareTo.getPawn().getColor().equals(moveDTO.getPawnColor())) {
                log.info("CHECKMATE");
                game.setActive(false);
            }
        }
    }


    public boolean isCastling(MoveDTO moveDTO) {
        Square e1 = getSquare("e1");
        Square a1 = getSquare("a1");

        //long castling white
        if ((moveDTO.getMoveFrom().equals("a1") && moveDTO.getMoveTo().equals("e1") && moveDTO.getPawnName().equals("rook")) || (moveDTO.getMoveFrom().equals("e1") && moveDTO.getMoveTo().equals("a1") && moveDTO.getPawnName().equals("king"))) {
            if (a1.getPawn().getName().equals("rook") && e1.getPawn().getName().equals("king")) {
                Square castlingSquareKing = new Square("c1", new King("white"));
                Square castlingSquareRook = new Square("d1", new Rook("white"));
                updateGameSquare(castlingSquareKing);
                updateGameSquare(castlingSquareRook);
                makeGameSquareEmpty(moveDTO.getMoveFrom());
                makeGameSquareEmpty(moveDTO.getMoveTo());
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


    public void makeGameSquareEmpty(String square) {
        Square[][] squares = game.getSquares();
        for (int i = 0; i < squares.length; i++) {
            for (int j = 0; j < squares[i].length; j++) {
                if (squares[i][j].getName().equals(square)) {
                    squares[i][j].setEmpty(true);
                    squares[i][j].setPawn(null);
                    break;
                }
            }
        }
        game.setSquares(squares);
    }


    public boolean checkIfPawnReachedEndBoard(MoveDTO moveDTO) {
        if (moveDTO.getMoveTo().equals("a1") || moveDTO.getMoveTo().equals("b1") || moveDTO.getMoveTo().equals("c1") || moveDTO.getMoveTo().equals("d1") || moveDTO.getMoveTo().equals("e1") || moveDTO.getMoveTo().equals("f1") || moveDTO.getMoveTo().equals("g1") || moveDTO.getMoveTo().equals("h1")) {
            if (moveDTO.getPawnName().equals("pawn") && moveDTO.getPawnColor().equals("black")) {
                Queen blackQueen = new Queen("black");
                Square square = new Square(moveDTO.getMoveTo(), blackQueen);
                updateGameSquare(square);
                makeGameSquareEmpty(moveDTO.getMoveFrom());
                return true;
            }
        } else if (moveDTO.getMoveTo().equals("a8") || moveDTO.getMoveTo().equals("b8") || moveDTO.getMoveTo().equals("c8") || moveDTO.getMoveTo().equals("d8") || moveDTO.getMoveTo().equals("e8") || moveDTO.getMoveTo().equals("f8") || moveDTO.getMoveTo().equals("g8") || moveDTO.getMoveTo().equals("h8")) {
            if (moveDTO.getPawnName().equals("pawn") && moveDTO.getPawnColor().equals("white")) {
                Queen blackQueen = new Queen("white");
                Square square = new Square(moveDTO.getMoveTo(), blackQueen);
                updateGameSquare(square);
                makeGameSquareEmpty(moveDTO.getMoveFrom());
                return true;
            }
        }
        return false;
    }
}
