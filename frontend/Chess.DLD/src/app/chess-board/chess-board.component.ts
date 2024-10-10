import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DataService } from '../data.service';

interface Pawn {
  pawnName: string;
  pawnColor: PawnColor;
  pawnPlacement: string;
}
type PawnColor = 'white' | 'black';



@Component({
  selector: 'app-chess-board',
  standalone: true,
  imports: [CommonModule, HttpClientModule,],
  templateUrl: './chess-board.component.html',
  styleUrl: './chess-board.component.css'
})
export class ChessBoardComponent {
  jsonResponse: Pawn[] = [];
  availableMoves: string[] = [];
  highlightedSquares: string[] = [];
  private selectedPawnInfo: any = null;
  

  constructor(private dataService: DataService) {
    this.dataService.getJsonData().subscribe(
      (res: any) => {
        this.jsonResponse = res;
        const transformedData: Pawn[] = [];

        res.chessBoard.forEach((row: any[]) => {
          row.forEach((pawn: any) => {
            transformedData.push({
              pawnName: pawn.name,
              pawnColor: pawn.color,
              pawnPlacement: pawn.square
            });
          });
        });
        this.jsonResponse = transformedData;
      },
      (error) => {
        console.error('Error fetching JSON data:', error);
      }
    );
  }
  getPawnOnSquare(square: string): Pawn | undefined {
    return this.jsonResponse.find(pawn => pawn.pawnPlacement === square);
  }

  getUniqueColor(color: PawnColor): string {
    const colorMap: Record<PawnColor, string> = {
      white: '#cccccc',
      black: '#666666',
    };
    return colorMap[color] || color;
  }
  
  showSquareDetails(square: any) {
    const pawnInfo = this.getPawnOnSquare(square.square);
    
    if (this.highlightedSquares.includes(square.square)) {
        if (this.selectedPawnInfo) {
            const moveDetails = {
                mov_from: this.selectedPawnInfo.pawnPlacement,
                mov_to: square.square,
                pawnName: this.selectedPawnInfo.pawnName,
                pawnColor: this.selectedPawnInfo.pawnColor
            };
            
            alert(JSON.stringify(moveDetails, null, 2));
            this.selectedPawnInfo = null;
            this.highlightedSquares = [];
            return;
        }
    }

    this.selectedPawnInfo = pawnInfo;

    this.highlightedSquares = [];
    if (pawnInfo) {
        this.availableMoves = this.getPossibleMoves(pawnInfo, this.chessBoard);
        this.highlightedSquares = this.availableMoves;
    } else {
        this.availableMoves = [];
    }
}


  
  

  

  getPossibleMoves(pawn: any, chessBoard: any) {
    let possibleMoves = [];

    switch (pawn.pawnName.toLowerCase()) {
      case 'pawn':
        possibleMoves = this.getPawnMoves(pawn, chessBoard, this.jsonResponse);
        break;
      // case 'rook':
      //     possibleMoves = this.getRookMoves(pawn);
      //     break;
      // case 'knight':
      //     possibleMoves = this.getKnightMoves(pawn);
      //     break;
      default:
        break;
    }

    return possibleMoves;
  }

  getPawnMoves(pawn: any, chessBoard: any, jsonResponse: any) {

    const combinedBoard = chessBoard.map((square: any) => {
      
      const correspondingPawn = jsonResponse.find((s: any) => s.pawnPlacement === square.square);
  
      return {
          ...square,
          pawn: correspondingPawn ? correspondingPawn.pawnName : null
      };
  });
    let moves = [];
    const currentPosition = pawn.pawnPlacement;
    const currentRow = parseInt(currentPosition[1]);
    const currentCol = currentPosition[0];
    const isOpponentPawn = (row: number, col: string) => {
      const targetSquare = col + row;
      const square = combinedBoard.find((s: any) => {
        return s.square === targetSquare;
      });
  
      if (square) {
        
        if (square.pawn) {
          return square.pawn.pawnColor !== pawn.pawnColor;
        } else {
          return false;
        }
      } else {
        return false;
      }
    };

    if (pawn.pawnColor === 'white') {
      const newRow = currentRow + 1;
      moves.push(currentCol + newRow);

      if (currentRow === 2) {
        const firstMoveRow = currentRow + 2;
        moves.push(currentPosition[0] + firstMoveRow);
      }
      const leftCol = String.fromCharCode(currentCol.charCodeAt(0) - 1);
      const rightCol = String.fromCharCode(currentCol.charCodeAt(0) + 1);
      if (isOpponentPawn(newRow, leftCol)) {
        moves.push(leftCol + newRow);
      }

      if (isOpponentPawn(newRow, rightCol)) {
        moves.push(rightCol + newRow);
      }
    } else {
      const newRow = currentRow - 1;
      moves.push(currentCol + newRow);

      if (currentRow === 7) {
        const firstMoveRow = currentRow - 2;
        moves.push(currentPosition[0] + firstMoveRow);
      }
      const leftCol = String.fromCharCode(currentCol.charCodeAt(0) - 1); 
      const rightCol = String.fromCharCode(currentCol.charCodeAt(0) + 1); 

      if (isOpponentPawn(newRow, leftCol)) {
        moves.push(leftCol + newRow);
      }

      if (isOpponentPawn(newRow, rightCol)) {
        moves.push(rightCol + newRow);
      }
    }

    return moves;
  }



  chessBoard: { square: string; color: string; }[] = [
    { square: 'a8', color: 'white' },
    { square: 'b8', color: 'black' },
    { square: 'c8', color: 'white' },
    { square: 'd8', color: 'black' },
    { square: 'e8', color: 'white' },
    { square: 'f8', color: 'black' },
    { square: 'g8', color: 'white' },
    { square: 'h8', color: 'black' },

    { square: 'a7', color: 'black' },
    { square: 'b7', color: 'white' },
    { square: 'c7', color: 'black' },
    { square: 'd7', color: 'white' },
    { square: 'e7', color: 'black' },
    { square: 'f7', color: 'white' },
    { square: 'g7', color: 'black' },
    { square: 'h7', color: 'white' },

    { square: 'a6', color: 'white' },
    { square: 'b6', color: 'black' },
    { square: 'c6', color: 'white' },
    { square: 'd6', color: 'black' },
    { square: 'e6', color: 'white' },
    { square: 'f6', color: 'black' },
    { square: 'g6', color: 'white' },
    { square: 'h6', color: 'black' },

    { square: 'a5', color: 'black' },
    { square: 'b5', color: 'white' },
    { square: 'c5', color: 'black' },
    { square: 'd5', color: 'white' },
    { square: 'e5', color: 'black' },
    { square: 'f5', color: 'white' },
    { square: 'g5', color: 'black' },
    { square: 'h5', color: 'white' },

    { square: 'a4', color: 'white' },
    { square: 'b4', color: 'black' },
    { square: 'c4', color: 'white' },
    { square: 'd4', color: 'black' },
    { square: 'e4', color: 'white' },
    { square: 'f4', color: 'black' },
    { square: 'g4', color: 'white' },
    { square: 'h4', color: 'black' },

    { square: 'a3', color: 'black' },
    { square: 'b3', color: 'white' },
    { square: 'c3', color: 'black' },
    { square: 'd3', color: 'white' },
    { square: 'e3', color: 'black' },
    { square: 'f3', color: 'white' },
    { square: 'g3', color: 'black' },
    { square: 'h3', color: 'white' },

    { square: 'a2', color: 'white' },
    { square: 'b2', color: 'black' },
    { square: 'c2', color: 'white' },
    { square: 'd2', color: 'black' },
    { square: 'e2', color: 'white' },
    { square: 'f2', color: 'black' },
    { square: 'g2', color: 'white' },
    { square: 'h2', color: 'black' },

    { square: 'a1', color: 'black' },
    { square: 'b1', color: 'white' },
    { square: 'c1', color: 'black' },
    { square: 'd1', color: 'white' },
    { square: 'e1', color: 'black' },
    { square: 'f1', color: 'white' },
    { square: 'g1', color: 'black' },
    { square: 'h1', color: 'white' },
  ]

}
