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

    //TODO OPTIMIZE METHODS AFTER DELETING HEAD DATA "Game"

    public Game createNewGame() {
        Game game = new Game();
        Chessboard chessboard = new Chessboard();
        Square[][] squares = new Square[8][8];

        char letter = 'a';

        for (int i = 0; i < squares.length; i++) {
            for (int j = 0; j < squares[i].length; j++) {

                letter = switch (j) {
                    case 0 -> 'a';
                    case 1 -> 'b';
                    case 2 -> 'c';
                    case 3 -> 'd';
                    case 4 -> 'e';
                    case 5 -> 'f';
                    case 6 -> 'g';
                    case 7 -> 'h';
                    default -> letter;
                };

                if (i == 1) { //possition 2
                    squares[i][j] = new Square(letter + "" + (squares.length - i), new Pawn("black"));
                } else if (i == 6) { //possition 7
                    squares[i][j] = new Square(letter + "" + (squares.length - i), new Pawn("white"));
                } else {
                    squares[i][j] = new Square(letter + "" + (squares.length - i));
                }
            }
        }

        //put Rooks
        squares[0][0].setPawn(new Rook("black"));
        squares[0][7].setPawn(new Rook("black"));

        squares[7][0].setPawn(new Rook("white"));
        squares[7][7].setPawn(new Rook("white"));
        //////

        //put Knights
        squares[0][1].setPawn(new Knight("black"));
        squares[0][6].setPawn(new Knight("black"));

        squares[7][1].setPawn(new Knight("white"));
        squares[7][6].setPawn(new Knight("white"));
        ///////

        //put Bishops
        squares[0][2].setPawn(new Bishop("black"));
        squares[0][5].setPawn(new Bishop("black"));

        squares[7][2].setPawn(new Bishop("white"));
        squares[7][5].setPawn(new Bishop("white"));
        ///////

        //put Queens
        squares[0][3].setPawn(new Queen("black"));
        squares[7][3].setPawn(new Queen("white"));
        ///////


        //put Kings
        squares[0][4].setPawn(new King("black"));
        squares[7][4].setPawn(new King("white"));
        ///////

        chessboard.setSquares(squares);
        game.setSquares(squares);

        game.setCurrentTour("white");

        return game;
    }


    protected PawnAbstract getPawnFromPosition(String position, Game game) {
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


    protected Square getSquare(String position, Game game) {
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


    public void nextTour(Game game) {
        if (game.getCurrentTour().equals("white")) {
            game.setCurrentTour("black");
        } else {
            game.setCurrentTour("white");
        }
    }


    public void printAllChessBoardSquares(Game game) {
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


    public GameStatementDTO getGameStatement(Game game) {
        GameStatementDTO gameStatementDTO = new GameStatementDTO();

        Square[][] squares = game.getSquares();
        List<SquareDTO> squareDTOS = new ArrayList<>();

        for (int i = 0; i < squares.length; i++) {
            for (int j = 0; j < squares[i].length; j++) {
                if (!squares[i][j].isEmpty()) {
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
        gameStatementDTO.setPlayerTour(game.getCurrentTour());
        return gameStatementDTO;
    }


    public void processMove(MoveDTO moveDTO, Game game) {
        checkIfCheckMate(moveDTO, game);

        if (isCastling(moveDTO, game)) {
        } else if (checkIfPawnReachedEndBoard(moveDTO, game)) {
        } else {
            Square squareTo = new Square(moveDTO.getMoveTo(), getSquare(moveDTO.getMoveFrom(), game).getPawn());
            updateGameSquare(squareTo, game);
            makeGameSquareEmpty(moveDTO.getMoveFrom(), game);
        }
    }


    protected void checkIfCheckMate(MoveDTO moveDTO, Game game) {
        Square squareTo = getSquare(moveDTO.getMoveTo(), game);
        if (!squareTo.isEmpty()) {
            if (squareTo.getPawn().getName().equals("king") && !squareTo.getPawn().getColor().equals(moveDTO.getPawnColor())) {
                log.info("CHECKMATE");
                game.setActive(false);
            }
        }
    }


    public void startGameIf2PlayersJoined(String gameId) {
        Game game = GameManageService.getGameById(gameId);
        if (game.getPlayers().size() == 2) {
            game.setStarted(true);
        }
    }


    //TODO OPTIMIZE AFTER CHANGES!!!
    protected boolean isCastling(MoveDTO moveDTO, Game game) {

        //long castling white
        if ((moveDTO.getMoveFrom().equals("a1") && moveDTO.getMoveTo().equals("e1") && moveDTO.getPawnName().equals("rook")) || (moveDTO.getMoveFrom().equals("e1") && moveDTO.getMoveTo().equals("a1") && moveDTO.getPawnName().equals("king"))) {
            Square e1 = getSquare("e1", game);
            Square a1 = getSquare("a1", game);
            if (a1.getPawn().getName().equals("rook") && e1.getPawn().getName().equals("king")) {
                if (a1.getPawn().getColor().equals("white") && e1.getPawn().getColor().equals("white")) {
                    Square castlingSquareKing = new Square("c1", new King("white"));
                    Square castlingSquareRook = new Square("d1", new Rook("white"));
                    updateGameSquare(castlingSquareKing, game);
                    updateGameSquare(castlingSquareRook, game);
                    makeGameSquareEmpty(moveDTO.getMoveFrom(), game);
                    makeGameSquareEmpty(moveDTO.getMoveTo(), game);
                    return true;
                }
            }
        }

        //short castling white
        if ((moveDTO.getMoveFrom().equals("h1") && moveDTO.getMoveTo().equals("e1") && moveDTO.getPawnName().equals("rook")) || (moveDTO.getMoveFrom().equals("e1") && moveDTO.getMoveTo().equals("h1") && moveDTO.getPawnName().equals("king"))) {
            Square e1 = getSquare("e1", game);
            Square h1 = getSquare("h1", game);
            if (h1.getPawn().getName().equals("rook") && e1.getPawn().getName().equals("king")) {
                if (h1.getPawn().getColor().equals("white") && e1.getPawn().getColor().equals("white")) {
                    Square castlingSquareKing = new Square("g1", new King("white"));
                    Square castlingSquareRook = new Square("f1", new Rook("white"));
                    updateGameSquare(castlingSquareKing, game);
                    updateGameSquare(castlingSquareRook, game);
                    makeGameSquareEmpty(moveDTO.getMoveFrom(), game);
                    makeGameSquareEmpty(moveDTO.getMoveTo(), game);
                    return true;
                }
            }
        }


        //long castling black
        if ((moveDTO.getMoveFrom().equals("a8") && moveDTO.getMoveTo().equals("e8") && moveDTO.getPawnName().equals("rook")) || (moveDTO.getMoveFrom().equals("e8") && moveDTO.getMoveTo().equals("a8") && moveDTO.getPawnName().equals("king"))) {
            Square e8 = getSquare("e8", game);
            Square a8 = getSquare("a8", game);
            if (a8.getPawn().getName().equals("rook") && e8.getPawn().getName().equals("king")) {
                if (a8.getPawn().getColor().equals("black") && e8.getPawn().getColor().equals("black")) {
                    Square castlingSquareKing = new Square("c8", new King("black"));
                    Square castlingSquareRook = new Square("d8", new Rook("black"));
                    updateGameSquare(castlingSquareKing, game);
                    updateGameSquare(castlingSquareRook, game);
                    makeGameSquareEmpty(moveDTO.getMoveFrom(), game);
                    makeGameSquareEmpty(moveDTO.getMoveTo(), game);
                    return true;
                }
            }
        }

        //short castling black
        if ((moveDTO.getMoveFrom().equals("h8") && moveDTO.getMoveTo().equals("e8") && moveDTO.getPawnName().equals("rook")) || (moveDTO.getMoveFrom().equals("e8") && moveDTO.getMoveTo().equals("h8") && moveDTO.getPawnName().equals("king"))) {
            Square e8 = getSquare("e8", game);
            Square h8 = getSquare("h8", game);
            if (h8.getPawn().getName().equals("rook") && e8.getPawn().getName().equals("king")) {
                if (h8.getPawn().getColor().equals("black") && e8.getPawn().getColor().equals("black")) {
                    Square castlingSquareKing = new Square("g8", new King("black"));
                    Square castlingSquareRook = new Square("f8", new Rook("black"));
                    updateGameSquare(castlingSquareKing, game);
                    updateGameSquare(castlingSquareRook, game);
                    makeGameSquareEmpty(moveDTO.getMoveFrom(), game);
                    makeGameSquareEmpty(moveDTO.getMoveTo(), game);
                    return true;
                }
            }
        }

        return false;
    }


    protected void updateGameSquare(Square squareToUpdate, Game game) {
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


    protected void makeGameSquareEmpty(String square, Game game) {
        Square[][] squares = game.getSquares();
        for (int i = 0; i < squares.length; i++) {
            for (int j = 0; j < squares[i].length; j++) {
                if (squares[i][j].getName().equals(square)) {
                    squares[i][j].setEmpty(true);
                    break;
                }
            }
        }
        game.setSquares(squares);
    }


    //TODO OPTIMIZE AFTER CHANGES!!!
    protected boolean checkIfPawnReachedEndBoard(MoveDTO moveDTO, Game game) {
        if (moveDTO.getMoveTo().equals("a1") || moveDTO.getMoveTo().equals("b1") || moveDTO.getMoveTo().equals("c1") || moveDTO.getMoveTo().equals("d1") || moveDTO.getMoveTo().equals("e1") || moveDTO.getMoveTo().equals("f1") || moveDTO.getMoveTo().equals("g1") || moveDTO.getMoveTo().equals("h1")) {
            if (moveDTO.getPawnName().equals("pawn") && moveDTO.getPawnColor().equals("black")) {
                Queen blackQueen = new Queen("black");
                Square square = new Square(moveDTO.getMoveTo(), blackQueen);
                updateGameSquare(square, game);
                makeGameSquareEmpty(moveDTO.getMoveFrom(), game);
                return true;
            }
        } else if (moveDTO.getMoveTo().equals("a8") || moveDTO.getMoveTo().equals("b8") || moveDTO.getMoveTo().equals("c8") || moveDTO.getMoveTo().equals("d8") || moveDTO.getMoveTo().equals("e8") || moveDTO.getMoveTo().equals("f8") || moveDTO.getMoveTo().equals("g8") || moveDTO.getMoveTo().equals("h8")) {
            if (moveDTO.getPawnName().equals("pawn") && moveDTO.getPawnColor().equals("white")) {
                Queen blackQueen = new Queen("white");
                Square square = new Square(moveDTO.getMoveTo(), blackQueen);
                updateGameSquare(square, game);
                makeGameSquareEmpty(moveDTO.getMoveFrom(), game);
                return true;
            }
        }
        return false;
    }
}
