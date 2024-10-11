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
  private originalPosition: string | null = null;




  constructor(private dataService: DataService) {
    this.dataService.getJsonData().subscribe(
      (res: any) => {
        const chessBoardData = res.chessBoard.map((pawn: any) => ({
          pawnName: pawn.name,
          pawnColor: pawn.color,
          pawnPlacement: pawn.square
        }));
  
        this.jsonResponse = chessBoardData;
      },
      (error) => {
        console.error('Error fetching JSON data:', error);
      }
    );
  }
  dropSquare(square: any) {
    if (this.highlightedSquares.includes(square.square)) {
      if (this.originalPosition) {
        const moveDetails = {
          moveFrom: this.originalPosition,
          moveTo: square.square,
          pawnName: this.selectedPawnInfo?.pawnName,
          pawnColor: this.selectedPawnInfo?.pawnColor
        };
        console.log('Sending the following move details:', JSON.stringify(moveDetails, null, 2));
  
        this.dataService.sendMoveDetails(moveDetails).subscribe(
          (response) => {
            console.log('Move details sent successfully:', response);
          },
          (error) => {
            console.error('Error sending move details:', error);
          }
        );
  
        this.dataService.GetBoardDetails(moveDetails).subscribe(
          (response: any) => {
            console.log('BoardUpdated', response);
  
            const updatedChessBoardData = response.chessBoard.map((pawn: any) => ({
              pawnName: pawn.name,
              pawnColor: pawn.color,
              pawnPlacement: pawn.square
            }));
  
            this.jsonResponse = updatedChessBoardData;
          },
          (error) => {
            console.error('Error Updating Board', error);
          }
        );
      }
    } else {
      if (this.originalPosition) {
        const pawn = this.jsonResponse.find(p => p.pawnPlacement === this.originalPosition);
        if (pawn) {
          pawn.pawnPlacement = this.originalPosition;
        }
      }
    }
  
    this.selectedPawnInfo = null;
    this.highlightedSquares = [];
    this.originalPosition = null;
  }
  
  showSquareDetails(square: any) {
    const pawnInfo = this.getPawnOnSquare(square.square);

    if (this.highlightedSquares.includes(square.square)) {
      if (this.selectedPawnInfo) {
        const moveDetails = {
          moveFrom: this.selectedPawnInfo.pawnPlacement,
          moveTo: square.square,
          pawnName: this.selectedPawnInfo.pawnName,
          pawnColor: this.selectedPawnInfo.pawnColor
        };

        console.log('Sending the following move details:', JSON.stringify(moveDetails, null, 2));
        //JSON RUCHU
        this.dataService.sendMoveDetails(moveDetails).subscribe(
          (response) => {
            console.log('Move details sent successfully:', response);
          },
          (error) => {
            console.error('Error sending move details:', error);
          }
        );
        this.dataService.GetBoardDetails(moveDetails).subscribe(
          (response: any) => {
            console.log('BoardUpdated', response);
  
            const updatedChessBoardData = response.chessBoard.map((pawn: any) => ({
              pawnName: pawn.name,
              pawnColor: pawn.color,
              pawnPlacement: pawn.square
            }));
  
            this.jsonResponse = updatedChessBoardData;
          },
          (error) => {
            console.error('Error Updating Board', error);
          }
        );
        this.selectedPawnInfo = null;
        this.highlightedSquares = [];
        return;
      }
    }

    this.selectedPawnInfo = pawnInfo;

    this.highlightedSquares = [];
    if (pawnInfo) {
      this.originalPosition = pawnInfo.pawnPlacement || '';


      this.selectedPawnInfo = pawnInfo;

      this.highlightedSquares = [];
      this.availableMoves = this.getPossibleMoves(pawnInfo, this.chessBoard);
      this.highlightedSquares = this.availableMoves;
    } else {
      this.availableMoves = [];
    }
  }



  getPawnOnSquare(square: string): Pawn | undefined {
    return this.jsonResponse.find(pawn => pawn.pawnPlacement === square);
  }


  clearHighlights() {
    this.highlightedSquares = [];
    this.availableMoves = [];
  }
  getUniqueColor(color: PawnColor): string {
    const colorMap: Record<PawnColor, string> = {
      white: '#cccccc',
      black: '#666666',
    };
    return colorMap[color] || color;
  }

  allowDrop(event: DragEvent) {
    event.preventDefault();
  }


  highlightAvailableMoves(pawn: Pawn, moves: string[]) {
    this.highlightedSquares = moves;
  }

  highlightMoves(square: any) {
    const pawnInfo = this.getPawnOnSquare(square.square);

    if (pawnInfo) {
      this.availableMoves = this.getPossibleMoves(pawnInfo, this.chessBoard);
      this.highlightAvailableMoves(pawnInfo, this.availableMoves);
    }
  }

  getPossibleMoves(pawn: any, chessBoard: any) {
    let possibleMoves = [];

    switch (pawn.pawnName.toLowerCase()) {
      case 'pawn':
        possibleMoves = this.getPawnMoves(pawn, chessBoard, this.jsonResponse);
        this.highlightAvailableMoves(pawn, possibleMoves);
        break;
      case 'knight':
        possibleMoves = this.getKnightMoves(pawn, chessBoard, this.jsonResponse);
        this.highlightAvailableMoves(pawn, possibleMoves);
        break;
        case 'rook':
        possibleMoves = this.getRookMoves(pawn, chessBoard, this.jsonResponse);
        this.highlightAvailableMoves(pawn, possibleMoves);
        break;
        case 'bishop':
        possibleMoves = this.getBishopMoves(pawn, chessBoard, this.jsonResponse);
        this.highlightAvailableMoves(pawn, possibleMoves);
        break;
        case 'king':
        possibleMoves = this.getKingMoves(pawn, chessBoard, this.jsonResponse);
        this.highlightAvailableMoves(pawn, possibleMoves);
        break;
        case 'queen':
        possibleMoves = this.getQueenMoves(pawn, chessBoard, this.jsonResponse);
        this.highlightAvailableMoves(pawn, possibleMoves);
        break;
      default:
        break;
    }

    return possibleMoves;
  }
  getKingMoves(pawn: any, chessBoard: any, jsonResponse: any): string[] {
    const combinedBoard = chessBoard.map((square: any) => {
        const correspondingPawn = jsonResponse.find((s: any) => s.pawnPlacement === square.square);
        return {
            ...square,
            pawn: correspondingPawn ? correspondingPawn : null
        };
    });

    const moves: string[] = [];
    const currentPosition = pawn.pawnPlacement;
    const currentRow = parseInt(currentPosition[1]);
    const currentCol = currentPosition[0].charCodeAt(0); 

    const kingMoves = [
        { rowOffset: 1, colOffset: 0 },   
        { rowOffset: -1, colOffset: 0 },  
        { rowOffset: 0, colOffset: 1 },    
        { rowOffset: 0, colOffset: -1 },   
        { rowOffset: 1, colOffset: 1 },     
        { rowOffset: 1, colOffset: -1 },    
        { rowOffset: -1, colOffset: 1 },   
        { rowOffset: -1, colOffset: -1 }    
    ];

    for (const { rowOffset, colOffset } of kingMoves) {
        const newRow = currentRow + rowOffset;
        const newCol = String.fromCharCode(currentCol + colOffset);

        if (newRow >= 1 && newRow <= 8 && newCol >= 'a' && newCol <= 'h') {
            const targetSquare = newCol + newRow;
            const square = combinedBoard.find((s: any) => s.square === targetSquare);

            if (square && !square.pawn) {
                moves.push(targetSquare);
            } else if (square && square.pawn) {
                if (square.pawn.pawnColor !== pawn.pawnColor) {
                    moves.push(targetSquare);
                }
            }
        }
    }

    return moves;
}
getQueenMoves(pawn: any, chessBoard: any, jsonResponse: any): string[] {
  const combinedBoard = chessBoard.map((square: any) => {
      const correspondingPawn = jsonResponse.find((s: any) => s.pawnPlacement === square.square);
      return {
          ...square,
          pawn: correspondingPawn ? correspondingPawn : null
      };
  });

  const moves: string[] = [];
  const currentPosition = pawn.pawnPlacement;
  const currentRow = parseInt(currentPosition[1]);
  const currentCol = currentPosition[0].charCodeAt(0); 

  const directions = [
      { rowOffset: 1, colOffset: 1 }, 
      { rowOffset: 1, colOffset: -1 },
      { rowOffset: -1, colOffset: 1 },
      { rowOffset: -1, colOffset: -1 },
      { rowOffset: -1, colOffset: 0 },
      { rowOffset: 1, colOffset: 0 },
      { rowOffset: 0, colOffset: 1 },
      { rowOffset: 0, colOffset: -1 } 
  ];

  for (const { rowOffset, colOffset } of directions) {
      let newRow = currentRow;
      let newCol = currentCol;

      while (true) {
          newRow += rowOffset;
          newCol += colOffset;

          if (newRow < 1 || newRow > 8 || newCol < 'a'.charCodeAt(0) || newCol > 'h'.charCodeAt(0)) {
              break; 
          }

          const targetSquare = String.fromCharCode(newCol) + newRow;
          const square = combinedBoard.find((s: any) => s.square === targetSquare);

          if (square && !square.pawn) {
              moves.push(targetSquare);
          } else if (square && square.pawn) {
              if (square.pawn.pawnColor !== pawn.pawnColor) {
                  moves.push(targetSquare);
              }
              break; 
          }
      }
  }

  return moves;
}
  getBishopMoves(pawn: any, chessBoard: any, jsonResponse: any): string[] {
    const combinedBoard = chessBoard.map((square: any) => {
        const correspondingPawn = jsonResponse.find((s: any) => s.pawnPlacement === square.square);
        return {
            ...square,
            pawn: correspondingPawn ? correspondingPawn : null
        };
    });

    const moves: string[] = [];
    const currentPosition = pawn.pawnPlacement;
    const currentRow = parseInt(currentPosition[1]);
    const currentCol = currentPosition[0].charCodeAt(0); 

    const directions = [
        { rowOffset: 1, colOffset: 1 }, 
        { rowOffset: 1, colOffset: -1 },
        { rowOffset: -1, colOffset: 1 },
        { rowOffset: -1, colOffset: -1 } 
    ];

    for (const { rowOffset, colOffset } of directions) {
        let newRow = currentRow;
        let newCol = currentCol;

        while (true) {
            newRow += rowOffset;
            newCol += colOffset;

            if (newRow < 1 || newRow > 8 || newCol < 'a'.charCodeAt(0) || newCol > 'h'.charCodeAt(0)) {
                break; 
            }

            const targetSquare = String.fromCharCode(newCol) + newRow;
            const square = combinedBoard.find((s: any) => s.square === targetSquare);

            if (square && !square.pawn) {
                moves.push(targetSquare);
            } else if (square && square.pawn) {
                if (square.pawn.pawnColor !== pawn.pawnColor) {
                    moves.push(targetSquare);
                }
                break; 
            }
        }
    }

    return moves;
}

  getRookMoves(pawn: any, chessBoard: any, jsonResponse: any): string[] {
    const combinedBoard = chessBoard.map((square: any) => {
        const correspondingPawn = jsonResponse.find((s: any) => s.pawnPlacement === square.square);
        return {
            ...square,
            pawn: correspondingPawn ? correspondingPawn : null
        };
    });

    const moves: string[] = [];
    const currentPosition = pawn.pawnPlacement;
    const currentRow = parseInt(currentPosition[1]);
    const currentCol = currentPosition[0].charCodeAt(0); 

    const directions = [
        { rowOffset: 1, colOffset: 0 },  
        { rowOffset: -1, colOffset: 0 }, 
        { rowOffset: 0, colOffset: 1 }, 
        { rowOffset: 0, colOffset: -1 }  
    ];

    for (const { rowOffset, colOffset } of directions) {
        let newRow = currentRow;
        let newCol = currentCol;

        while (true) {
            newRow += rowOffset;
            newCol += colOffset;

            if (newRow < 1 || newRow > 8 || newCol < 'a'.charCodeAt(0) || newCol > 'h'.charCodeAt(0)) {
                break; 
            }

            const targetSquare = String.fromCharCode(newCol) + newRow;
            const square = combinedBoard.find((s: any) => s.square === targetSquare);

            if (square && !square.pawn) {
                moves.push(targetSquare);
            } else if (square && square.pawn) {
                if (square.pawn.pawnColor !== pawn.pawnColor) {
                    moves.push(targetSquare);
                }
                break; 
            }
        }
    }

    return moves;
}


  
  getKnightMoves(pawn: any, chessBoard: any, jsonResponse: any): string[] {
    const combinedBoard = chessBoard.map((square: any) => {
      const correspondingPawn = jsonResponse.find((s: any) => s.pawnPlacement === square.square);
      return {
        ...square,
        pawn: correspondingPawn ? correspondingPawn : null
      };
    });

    const moves: string[] = [];
    const currentPosition = pawn.pawnPlacement;
    const currentRow = parseInt(currentPosition[1]);
    const currentCol = currentPosition[0].charCodeAt(0);

    const knightMoves = [
      [2, 1], [2, -1], [-2, 1], [-2, -1],
      [1, 2], [1, -2], [-1, 2], [-1, -2]
    ];


    for (const [rowOffset, colOffset] of knightMoves) {
      const newRow = currentRow + rowOffset;
      const newCol = String.fromCharCode(currentCol + colOffset);

      if (newRow >= 1 && newRow <= 8 && newCol >= 'a' && newCol <= 'h') {
        const targetSquare = newCol + newRow;
        const square = combinedBoard.find((s: any) => s.square === targetSquare);

        if (square && square.pawn && square.pawn.pawnColor === pawn.pawnColor) {
          continue;
        }

        moves.push(targetSquare);
      } else {
      }
    }

    return moves;
  }

  getPawnMoves(pawn: any, chessBoard: any, jsonResponse: any) {
    const combinedBoard = chessBoard.map((square: any) => {
      const correspondingPawn = jsonResponse.find((s: any) => s.pawnPlacement === square.square);
      return {
        ...square,
        pawn: correspondingPawn ? correspondingPawn : null
      };
    });

    let moves = [];
    const currentPosition = pawn.pawnPlacement;
    const currentRow = parseInt(currentPosition[1]);
    const currentCol = currentPosition[0];

    const isOpponentPawn = (row: number, col: string) => {
      const targetSquare = col + row;
      const square = combinedBoard.find((s: any) => s.square === targetSquare);
      return square && square.pawn && square.pawn.pawnColor !== pawn.pawnColor;
    };

    const isSameColorPawn = (row: number, col: string) => {
      const targetSquare = col + row;
      const square = combinedBoard.find((s: any) => s.square === targetSquare);
      return square && square.pawn && square.pawn.pawnColor === pawn.pawnColor;
    };

    const isBlocked = (row: number, col: string) => {
      const targetSquare = col + row;
      const square = combinedBoard.find((s: any) => s.square === targetSquare);
      return square && square.pawn !== null;
    };

    if (pawn.pawnColor === 'white') {
      const newRow = currentRow + 1;
      if (!isBlocked(newRow, currentCol) && !isSameColorPawn(newRow, currentCol)) {
        moves.push(currentCol + newRow);
      }

      if (currentRow === 2) {
        const firstMoveRow = currentRow + 2;
        if (!isBlocked(newRow, currentCol) && !isBlocked(firstMoveRow, currentCol) && !isSameColorPawn(firstMoveRow, currentCol)) {
          moves.push(currentPosition[0] + firstMoveRow);
        }
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
      if (!isBlocked(newRow, currentCol) && !isSameColorPawn(newRow, currentCol)) {
        moves.push(currentCol + newRow);
      }

      if (currentRow === 7) {
        const firstMoveRow = currentRow - 2;
        if (!isBlocked(newRow, currentCol) && !isBlocked(firstMoveRow, currentCol) && !isSameColorPawn(firstMoveRow, currentCol)) {
          moves.push(currentPosition[0] + firstMoveRow);
        }
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
