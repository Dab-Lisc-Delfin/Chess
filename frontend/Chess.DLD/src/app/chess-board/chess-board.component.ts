import { Component, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DataService } from '../data.service';
import { ActivatedRoute } from '@angular/router';

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
  isGameActive: boolean = true;
  whiteDangerZone: string[] = [];
  blackDangerZone: string[] = [];
  checkmateMessage: boolean = false;
  checkmateSquare: string | null = null;
  gameId: string | null = '';
  moveHistory: Array<{ moveFrom: string, moveTo: string, pawnColor: string, pawnName: string }> = [];
  moveCounter: number = 0;
  highlightedSquare11: string[] = [];
  @ViewChild('historyContainer') historyContainer!: ElementRef;
  resetGame() {
    this.dataService.getJsonData().subscribe(
      (res: any) => {
        const chessBoardData = res.chessBoard.map((pawn: any) => ({
          pawnName: pawn.name,
          pawnColor: pawn.color,
          pawnPlacement: pawn.square
        }));
        this.selectedPawnInfo = null;
        this.highlightedSquares = [];
        this.jsonResponse = chessBoardData;
        this.isGameActive = true;

      },
      (error) => {
        console.error('Error fetching JSON data during reset:', error);
      }
    );
  }
  handleCheckmate(square: string) {
    this.checkmateSquare = square;
    this.checkmateMessage = true;

    setTimeout(() => {
      this.checkmateMessage = false;
      this.checkmateSquare = null;
    }, 2500);
  }
  getTurnNumber(index: number): number {
    return Math.floor(index / 2) + 1;
  }
  getTurnIndexes(): number[] {
    const indexes = [];
    for (let i = 0; i < this.moveHistory.length; i += 2) {
      indexes.push(i);
    }
    return indexes;
  }

  highlightSquare11(square: string): void {
    if (!this.highlightedSquare11.includes(square)) {
      this.highlightedSquare11.push(square);
    }
  }

  removeHighlight11(): void {
    this.highlightedSquare11 = [];
  }
  scrollToBottom(): void {
    setTimeout(() => {
      try {
        this.historyContainer.nativeElement.scrollTop = this.historyContainer.nativeElement.scrollHeight;
      } catch (err) {
        console.error('Scroll error: ', err);
      }
    }, 10);
  }
  constructor(private route: ActivatedRoute, private dataService: DataService) {
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
  ngOnInit(): void {
    // this.checkmateSquare = 'e1'; 
    this.gameId = this.route.snapshot.paramMap.get('id');
  }


  dropSquare(square: any) {
    // console.log('DropSquare called with square:', square);
    if (!this.isGameActive) {
      return;
    }

    if (this.highlightedSquares.includes(square.square)) {
      if (this.originalPosition) {
        const moveDetails = {
          moveFrom: this.originalPosition,
          moveTo: square.square,
          pawnName: this.selectedPawnInfo?.pawnName,
          pawnColor: this.selectedPawnInfo?.pawnColor
        };

        // console.log('Sending the following move details:', JSON.stringify(moveDetails, null, 2));
        // JSON RUCHU
        const originalPosition = this.selectedPawnInfo.pawnPlacement;
        const originalBoardPosition = this.jsonResponse;
        let whiteKingPosition = '';
        let blackKingPosition = '';
        let whiteKingBeforeNewPosition = '';
        let blackKingBeforeNewPosition = '';
        let kingCanBeSaved = false;
        const PawnTableBeforeMove = this.jsonResponse;
        this.jsonResponse.forEach((pawn: any) => {
          if (pawn.pawnName === 'king') {
            if (pawn.pawnColor === 'white') {
              whiteKingBeforeNewPosition = pawn.pawnPlacement;
            } else if (pawn.pawnColor === 'black') {
              blackKingBeforeNewPosition = pawn.pawnPlacement;
            }
          }
        });
        this.jsonResponse = this.jsonResponse.map((pawn: any) => {
          if (pawn.pawnPlacement === originalPosition) {
            return {
              ...pawn,
              pawnPlacement: square.square,
            };
          }
          return pawn;
        });
        const targetPawn = this.jsonResponse.find((pawn: any) =>
          pawn.pawnPlacement === square.square && pawn.pawnColor !== moveDetails.pawnColor
        );
        let moveSound: HTMLAudioElement;
        if (targetPawn) {
          moveSound = new Audio('/move-take.mp3');
          this.jsonResponse = this.jsonResponse.filter((pawn: any) =>
            pawn.pawnPlacement !== square.square || pawn.pawnColor === moveDetails.pawnColor
          );
        } else {
          moveSound = new Audio('/move-sound.wav');
        }

        const allWhiteMoves: string[] = [];
        const allBlackMoves: string[] = [];



        this.jsonResponse.forEach((pawn: any) => {
          if (pawn) {
            const possibleMoves = this.getAllPossibleMoves(pawn, this.chessBoard, this.jsonResponse);
            // console.log('POSSIBLE MOVES',possibleMoves)
            if (pawn.pawnName === 'king' && pawn.pawnColor === 'white') {
              whiteKingPosition = pawn.pawnPlacement;
            }
            if (pawn.pawnName === 'king' && pawn.pawnColor === 'black') {
              blackKingPosition = pawn.pawnPlacement;
            }
            if (pawn.pawnColor === 'white') {
              allWhiteMoves.push(...possibleMoves);
            } else if (pawn.pawnColor === 'black') {
              allBlackMoves.push(...possibleMoves);
            }
          }
        });


        if ((moveDetails.pawnColor === 'white' && allBlackMoves.includes(whiteKingPosition)) || (moveDetails.pawnColor === 'black' && allWhiteMoves.includes(blackKingPosition))) {
          moveSound = new Audio('/error.wav');
          moveSound.volume = 0.05;
          moveSound.play();
          // console.log(PawnTableBeforeMove)
          // console.log(whiteKingBeforeNewPosition, ' white')
          // console.log(blackKingBeforeNewPosition, 'black')
          const testBlack = blackKingBeforeNewPosition;
          const testWhite = whiteKingBeforeNewPosition;
          this.jsonResponse.forEach((pawn: any) => {
            if (pawn.pawnName === 'king') {
              if (pawn.pawnColor === 'white') {
                // console.log(`Updating white king from ${pawn.pawnPlacement} to ${testWhite}`);
                pawn.pawnPlacement = testWhite;
              } else if (pawn.pawnColor === 'black') {
                // console.log(`Updating black king from ${pawn.pawnPlacement} to ${testBlack}`);
                pawn.pawnPlacement = testBlack; 
              }
            }
          });
          const whiteMovesMap: { [key: string]: string[] } = {};
          const blackMovesMap: { [key: string]: string[] } = {};

          this.jsonResponse.forEach((pawn: any) => {
            if (pawn) {
              const possibleMoves = this.getAllPossibleMoves(pawn, this.chessBoard, PawnTableBeforeMove);

              // Save king positions
              if (pawn.pawnName === 'king' && pawn.pawnColor === 'white') {
                whiteKingPosition = pawn.pawnPlacement;
              }
              if (pawn.pawnName === 'king' && pawn.pawnColor === 'black') {
                blackKingPosition = pawn.pawnPlacement;
              }

              const pawnKey = `${pawn.pawnColor}_${pawn.pawnName}_${pawn.pawnPlacement}`;

              if (pawn.pawnColor === 'white') {
                whiteMovesMap[pawnKey] = possibleMoves;
              } else if (pawn.pawnColor === 'black') {
                blackMovesMap[pawnKey] = possibleMoves;
              }
            }
          });

          // console.log("White Pawns and their possible moves:", whiteMovesMap);
          // console.log("Black Pawns and their possible moves:", blackMovesMap);
          const isKingUnderThreatAfterOpponentMoves = (
            kingColor: string,
            whiteMovesMap: { [key: string]: string[] },
            blackMovesMap: { [key: string]: string[] },
            whiteKingBeforeNewPosition: string,
            blackKingBeforeNewPosition: string
          ): boolean => {

            const opponentMovesMap = kingColor === 'white' ? blackMovesMap : whiteMovesMap;
            const kingPosition = kingColor === 'white' ? whiteKingBeforeNewPosition : blackKingBeforeNewPosition;

            // console.log(`Checking if ${kingColor === 'white' ? 'white' : 'black'} king is under threat at ${kingPosition}`);

            let attackingPawnKey = ''; 

            for (const [pawnKey, possibleMoves] of Object.entries(opponentMovesMap)) {
              // console.log(`${pawnKey} can move to:`, possibleMoves);

              if (possibleMoves.includes(kingPosition)) {
                // console.log(`King is under threat from ${pawnKey} moving to ${kingPosition}`);
                attackingPawnKey = pawnKey; 
                break;
              }
            }

            if (!attackingPawnKey) {
              // console.log('No immediate threats to the king.');
              return false;
            }

            const yourMovesMap = kingColor === 'white' ? whiteMovesMap : blackMovesMap;

            for (const [yourPawnKey, possibleMoves] of Object.entries(yourMovesMap)) {
              const yourPawnDetails = this.parsePawnKey(yourPawnKey);
              for (const move of possibleMoves) {
                // console.log(testWhite, ' white111')
                // console.log(testBlack, 'black111')
                this.jsonResponse.forEach((pawn: any) => {
                  if (pawn.pawnName === 'king') {
                    if (pawn.pawnColor === 'white') {
                      // console.log(`Updating white king from ${pawn.pawnPlacement} to ${testWhite}`);
                      pawn.pawnPlacement = testWhite; 
                    } else if (pawn.pawnColor === 'black') {
                      // console.log(`Updating black king from ${pawn.pawnPlacement} to ${testBlack}`);
                      pawn.pawnPlacement = testBlack; 
                    }
                  }
                });
                // console.log(this.jsonResponse)
                // console.log(`${yourPawnDetails.pawnName} (${yourPawnDetails.pawnColor}) is trying to MOVE to ${move}`);
                let simulatedJsonResponse = JSON.parse(JSON.stringify(this.jsonResponse));
                const originalPosition = yourPawnDetails.pawnPlacement;

                const pieceIndex = simulatedJsonResponse.findIndex((pawn: any) => pawn.pawnPlacement === originalPosition);
                if (pieceIndex !== -1) {
                  simulatedJsonResponse.splice(pieceIndex, 1);
                }
            
                const newPositionIndex = simulatedJsonResponse.findIndex((pawn: any) => pawn.pawnPlacement === move);
                if (newPositionIndex !== -1) {
                  simulatedJsonResponse.splice(newPositionIndex, 1); 
                }
            
                simulatedJsonResponse.push({
                  pawnName: yourPawnDetails.pawnName,
                  pawnColor: yourPawnDetails.pawnColor,
                  pawnPlacement: move
                });

                // console.log("Simulated jsonResponse after the move:", simulatedJsonResponse);

                const allWhiteMovesCheck: string[] = [];
                const allBlackMovesCheck: string[] = [];


                let whiteKingPositionCheck: string | null = null;
                let blackKingPositionCheck: string | null = null;
                simulatedJsonResponse.forEach((pawn: any) => {
                  if (pawn) {
                    const possibleMoves = this.getAllPossibleMoves(pawn, this.chessBoard, simulatedJsonResponse);
                
                    if (pawn.pawnName === 'king') {
                      if (pawn.pawnColor === 'white') {
                        whiteKingPositionCheck = pawn.pawnPlacement; 
                        allWhiteMovesCheck.push(...possibleMoves);
                      } else if (pawn.pawnColor === 'black') {
                        blackKingPositionCheck = pawn.pawnPlacement; 
                        allBlackMovesCheck.push(...possibleMoves);
                      }
                    } else {
                      if (pawn.pawnColor === 'white') {
                        allWhiteMovesCheck.push(...possibleMoves);
                      } else if (pawn.pawnColor === 'black') {
                        allBlackMovesCheck.push(...possibleMoves);
                      }
                    }
                  }
                });
                
                // console.log(allBlackMovesCheck, 'BLACK CHECK')
                // console.log(allWhiteMovesCheck, 'WHITE CHECK')
                console.log(blackKingPositionCheck);
                if ((whiteKingPositionCheck && allBlackMovesCheck.includes(whiteKingPositionCheck)) || (blackKingPositionCheck && allWhiteMovesCheck.includes(blackKingPositionCheck))) {
                  // console.log('This move cant save you')
                  simulatedJsonResponse = JSON.parse(JSON.stringify(this.jsonResponse));
                  continue;
                } else {
                  // console.log('this move can save you')
                  simulatedJsonResponse = JSON.parse(JSON.stringify(this.jsonResponse));
                  kingCanBeSaved = true;
                  break;
                }
              }
            }
            if (kingCanBeSaved) {
              // console.log('The game can go on. A move has been found to save the king.');
            } else {
              // console.log('Checkmate! No move can save the king.');
              this.resetGame();
              return false;
            }
            return false;
          };


          const isWhiteKingInCheck = isKingUnderThreatAfterOpponentMoves('white', whiteMovesMap, blackMovesMap, whiteKingPosition, blackKingPosition);
          const isBlackKingInCheck = isKingUnderThreatAfterOpponentMoves('black', whiteMovesMap, blackMovesMap, whiteKingPosition, blackKingPosition);

          // Log results
          // console.log(`Is the White King in check? ${isWhiteKingInCheck ? 'Yes' : 'No'}`);
          // console.log(`Is the Black King in check? ${isBlackKingInCheck ? 'Yes' : 'No'}`);



          if (moveDetails.pawnColor === 'black') {
            this.checkmateSquare = blackKingBeforeNewPosition;
          } else {
            this.checkmateSquare = whiteKingBeforeNewPosition;
          }
          this.handleCheckmate(this.checkmateSquare);
          this.jsonResponse = JSON.parse(JSON.stringify(originalBoardPosition));
          return;
        }
        this.dataService.sendMoveDetails(moveDetails).subscribe(
          (response) => {
            // console.log('Move details sent successfully:', response);
            this.moveCounter++;
            this.moveHistory.push(moveDetails);
            this.scrollToBottom();
            // console.log(moveDetails.moveTo, moveDetails.pawnColor,moveDetails.pawnName)
            this.dataService.GetBoardDetails().subscribe(
              (response: any) => {
                // console.log('BoardUpdated', response);

                const updatedChessBoardData = response.chessBoard.map((pawn: any) => ({
                  pawnName: pawn.name,
                  pawnColor: pawn.color,
                  pawnPlacement: pawn.square
                }));

                this.jsonResponse = updatedChessBoardData;
                moveSound.volume = 0.1;
                moveSound.play();

                if (!response.gameActive) {
                  this.isGameActive = false;
                }

              },
              (error) => {
                console.error('Error Updating Board', error);
              }
            );
          },
          (error) => {
            console.error('Error sending move details:', error);
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
    // console.log('ShowSquareDetails called with square:', square);
    if (!this.isGameActive) {
      return;
    }

    const pawnInfo = this.getPawnOnSquare(square.square);
    // console.log('Pawn info for square:', pawnInfo);

    if (this.highlightedSquares.includes(square.square)) {
      if (this.selectedPawnInfo) {
        const moveDetails = {
          moveFrom: this.selectedPawnInfo.pawnPlacement,
          moveTo: square.square,
          pawnName: this.selectedPawnInfo.pawnName,
          pawnColor: this.selectedPawnInfo.pawnColor
        };

        // console.log('Sending the following move details:', JSON.stringify(moveDetails, null, 2));
        // JSON RUCHU
        const originalPosition = this.selectedPawnInfo.pawnPlacement;
        const originalBoardPosition = this.jsonResponse;
        let whiteKingPosition = '';
        let blackKingPosition = '';
        let whiteKingBeforeNewPosition = '';
        let blackKingBeforeNewPosition = '';
        let kingCanBeSaved = false;
        const PawnTableBeforeMove = this.jsonResponse;
        this.jsonResponse.forEach((pawn: any) => {
          if (pawn.pawnName === 'king') {
            if (pawn.pawnColor === 'white') {
              whiteKingBeforeNewPosition = pawn.pawnPlacement;
            } else if (pawn.pawnColor === 'black') {
              blackKingBeforeNewPosition = pawn.pawnPlacement;
            }
          }
        });
        this.jsonResponse = this.jsonResponse.map((pawn: any) => {
          if (pawn.pawnPlacement === originalPosition) {
            return {
              ...pawn,
              pawnPlacement: square.square,
            };
          }
          return pawn;
        });
        const targetPawn = this.jsonResponse.find((pawn: any) =>
          pawn.pawnPlacement === square.square && pawn.pawnColor !== moveDetails.pawnColor
        );
        let moveSound: HTMLAudioElement;
        if (targetPawn) {
          moveSound = new Audio('/move-take.mp3');
          this.jsonResponse = this.jsonResponse.filter((pawn: any) =>
            pawn.pawnPlacement !== square.square || pawn.pawnColor === moveDetails.pawnColor
          );
        } else {
          moveSound = new Audio('/move-sound.wav');
        }

        const allWhiteMoves: string[] = [];
        const allBlackMoves: string[] = [];



        this.jsonResponse.forEach((pawn: any) => {
          if (pawn) {
            const possibleMoves = this.getAllPossibleMoves(pawn, this.chessBoard, this.jsonResponse);
            // console.log('POSSIBLE MOVES',possibleMoves)
            if (pawn.pawnName === 'king' && pawn.pawnColor === 'white') {
              whiteKingPosition = pawn.pawnPlacement;
            }
            if (pawn.pawnName === 'king' && pawn.pawnColor === 'black') {
              blackKingPosition = pawn.pawnPlacement;
            }
            if (pawn.pawnColor === 'white') {
              allWhiteMoves.push(...possibleMoves);
            } else if (pawn.pawnColor === 'black') {
              allBlackMoves.push(...possibleMoves);
            }
          }
        });

        if ((moveDetails.pawnColor === 'white' && allBlackMoves.includes(whiteKingPosition)) || (moveDetails.pawnColor === 'black' && allWhiteMoves.includes(blackKingPosition))) {
          moveSound = new Audio('/error.wav');
          moveSound.volume = 0.05;
          moveSound.play();
          console.log(PawnTableBeforeMove)
          console.log(whiteKingBeforeNewPosition, ' white')
          console.log(blackKingBeforeNewPosition, 'black')
          const testBlack = blackKingBeforeNewPosition;
          const testWhite = whiteKingBeforeNewPosition;
          this.jsonResponse.forEach((pawn: any) => {
            if (pawn.pawnName === 'king') {
              if (pawn.pawnColor === 'white') {
                // console.log(`Updating white king from ${pawn.pawnPlacement} to ${testWhite}`);
                pawn.pawnPlacement = testWhite;
              } else if (pawn.pawnColor === 'black') {
                // console.log(`Updating black king from ${pawn.pawnPlacement} to ${testBlack}`);
                pawn.pawnPlacement = testBlack; 
              }
            }
          });
          const whiteMovesMap: { [key: string]: string[] } = {};
          const blackMovesMap: { [key: string]: string[] } = {};

          this.jsonResponse.forEach((pawn: any) => {
            if (pawn) {
              const possibleMoves = this.getAllPossibleMoves(pawn, this.chessBoard, PawnTableBeforeMove);

              // Save king positions
              if (pawn.pawnName === 'king' && pawn.pawnColor === 'white') {
                whiteKingPosition = pawn.pawnPlacement;
              }
              if (pawn.pawnName === 'king' && pawn.pawnColor === 'black') {
                blackKingPosition = pawn.pawnPlacement;
              }

              const pawnKey = `${pawn.pawnColor}_${pawn.pawnName}_${pawn.pawnPlacement}`;

              if (pawn.pawnColor === 'white') {
                whiteMovesMap[pawnKey] = possibleMoves;
              } else if (pawn.pawnColor === 'black') {
                blackMovesMap[pawnKey] = possibleMoves;
              }
            }
          });

          // console.log("White Pawns and their possible moves:", whiteMovesMap);
          // console.log("Black Pawns and their possible moves:", blackMovesMap);
          const isKingUnderThreatAfterOpponentMoves = (
            kingColor: string,
            whiteMovesMap: { [key: string]: string[] },
            blackMovesMap: { [key: string]: string[] },
            whiteKingBeforeNewPosition: string,
            blackKingBeforeNewPosition: string
          ): boolean => {

            const opponentMovesMap = kingColor === 'white' ? blackMovesMap : whiteMovesMap;
            const kingPosition = kingColor === 'white' ? whiteKingBeforeNewPosition : blackKingBeforeNewPosition;

            // console.log(`Checking if ${kingColor === 'white' ? 'white' : 'black'} king is under threat at ${kingPosition}`);

            let attackingPawnKey = ''; 

            for (const [pawnKey, possibleMoves] of Object.entries(opponentMovesMap)) {
              // console.log(`${pawnKey} can move to:`, possibleMoves);

              if (possibleMoves.includes(kingPosition)) {
                // console.log(`King is under threat from ${pawnKey} moving to ${kingPosition}`);
                attackingPawnKey = pawnKey; 
                break;
              }
            }

            if (!attackingPawnKey) {
              // console.log('No immediate threats to the king.');
              return false;
            }

            const yourMovesMap = kingColor === 'white' ? whiteMovesMap : blackMovesMap;

            for (const [yourPawnKey, possibleMoves] of Object.entries(yourMovesMap)) {
              const yourPawnDetails = this.parsePawnKey(yourPawnKey);
              for (const move of possibleMoves) {
                // console.log(testWhite, ' white111')
                // console.log(testBlack, 'black111')
                this.jsonResponse.forEach((pawn: any) => {
                  if (pawn.pawnName === 'king') {
                    if (pawn.pawnColor === 'white') {
                      // console.log(`Updating white king from ${pawn.pawnPlacement} to ${testWhite}`);
                      pawn.pawnPlacement = testWhite; 
                    } else if (pawn.pawnColor === 'black') {
                      // console.log(`Updating black king from ${pawn.pawnPlacement} to ${testBlack}`);
                      pawn.pawnPlacement = testBlack; 
                    }
                  }
                });
                // console.log(this.jsonResponse)
                // console.log(`${yourPawnDetails.pawnName} (${yourPawnDetails.pawnColor}) is trying to MOVE to ${move}`);
                let simulatedJsonResponse = JSON.parse(JSON.stringify(this.jsonResponse));
                const originalPosition = yourPawnDetails.pawnPlacement;

                const pieceIndex = simulatedJsonResponse.findIndex((pawn: any) => pawn.pawnPlacement === originalPosition);
                if (pieceIndex !== -1) {
                  simulatedJsonResponse.splice(pieceIndex, 1);
                }
            
                const newPositionIndex = simulatedJsonResponse.findIndex((pawn: any) => pawn.pawnPlacement === move);
                if (newPositionIndex !== -1) {
                  simulatedJsonResponse.splice(newPositionIndex, 1); 
                }
            
                simulatedJsonResponse.push({
                  pawnName: yourPawnDetails.pawnName,
                  pawnColor: yourPawnDetails.pawnColor,
                  pawnPlacement: move
                });

                // console.log("Simulated jsonResponse after the move:", simulatedJsonResponse);

                const allWhiteMovesCheck: string[] = [];
                const allBlackMovesCheck: string[] = [];


                let whiteKingPositionCheck: string | null = null;
                let blackKingPositionCheck: string | null = null;
                simulatedJsonResponse.forEach((pawn: any) => {
                  if (pawn) {
                    const possibleMoves = this.getAllPossibleMoves(pawn, this.chessBoard, simulatedJsonResponse);
                
                    if (pawn.pawnName === 'king') {
                      if (pawn.pawnColor === 'white') {
                        whiteKingPositionCheck = pawn.pawnPlacement; 
                        allWhiteMovesCheck.push(...possibleMoves);
                      } else if (pawn.pawnColor === 'black') {
                        blackKingPositionCheck = pawn.pawnPlacement; 
                        allBlackMovesCheck.push(...possibleMoves);
                      }
                    } else {
                      if (pawn.pawnColor === 'white') {
                        allWhiteMovesCheck.push(...possibleMoves);
                      } else if (pawn.pawnColor === 'black') {
                        allBlackMovesCheck.push(...possibleMoves);
                      }
                    }
                  }
                });
                
                // console.log(allBlackMovesCheck, 'BLACK CHECK')
                // console.log(allWhiteMovesCheck, 'WHITE CHECK')
                console.log(blackKingPositionCheck);
                if ((whiteKingPositionCheck && allBlackMovesCheck.includes(whiteKingPositionCheck)) || (blackKingPositionCheck && allWhiteMovesCheck.includes(blackKingPositionCheck))) {
                  // console.log('This move cant save you')
                  simulatedJsonResponse = JSON.parse(JSON.stringify(this.jsonResponse));
                  continue;
                } else {
                  // console.log('this move can save you')
                  simulatedJsonResponse = JSON.parse(JSON.stringify(this.jsonResponse));
                  kingCanBeSaved = true;
                  break;
                }
              }
            }
            if (kingCanBeSaved) {
              // console.log('The game can go on. A move has been found to save the king.');
            } else {
              // console.log('Checkmate! No move can save the king.');
              this.resetGame();
              return false;
            }
            return false;
          };


          const isWhiteKingInCheck = isKingUnderThreatAfterOpponentMoves('white', whiteMovesMap, blackMovesMap, whiteKingPosition, blackKingPosition);
          const isBlackKingInCheck = isKingUnderThreatAfterOpponentMoves('black', whiteMovesMap, blackMovesMap, whiteKingPosition, blackKingPosition);

          // Log results
          // console.log(`Is the White King in check? ${isWhiteKingInCheck ? 'Yes' : 'No'}`);
          // console.log(`Is the Black King in check? ${isBlackKingInCheck ? 'Yes' : 'No'}`);



          if (moveDetails.pawnColor === 'black') {
            this.checkmateSquare = blackKingBeforeNewPosition;
          } else {
            this.checkmateSquare = whiteKingBeforeNewPosition;
          }
          this.handleCheckmate(this.checkmateSquare);
          this.jsonResponse = JSON.parse(JSON.stringify(originalBoardPosition));
          return;
        }
        this.dataService.sendMoveDetails(moveDetails).subscribe(
          (response) => {
            // console.log('Move details sent successfully:', response);
            this.moveCounter++;
            this.moveHistory.push(moveDetails);
            this.scrollToBottom();
            // console.log(moveDetails.moveTo, moveDetails.pawnColor,moveDetails.pawnName)
            this.dataService.GetBoardDetails().subscribe(
              (response: any) => {
                // console.log('BoardUpdated', response);

                const updatedChessBoardData = response.chessBoard.map((pawn: any) => ({
                  pawnName: pawn.name,
                  pawnColor: pawn.color,
                  pawnPlacement: pawn.square
                }));

                this.jsonResponse = updatedChessBoardData;
                moveSound.volume = 0.1;
                moveSound.play();

                if (!response.gameActive) {
                  this.isGameActive = false;
                }

              },
              (error) => {
                console.error('Error Updating Board', error);
              }
            );
          },
          (error) => {
            console.error('Error sending move details:', error);
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
      // console.log('Selected pawn info:', pawnInfo);
      this.availableMoves = this.getPossibleMoves(pawnInfo, this.chessBoard);
      this.highlightedSquares = this.availableMoves;
      // console.log('Available moves for selected pawn:', this.availableMoves);
    } else {
      this.availableMoves = [];
      // console.log('No available moves found.');
    }
  }
  parsePawnKey = (pawnKey: string) => {
    const [pawnColor, pawnName, pawnPlacement] = pawnKey.split('_');
    return {
      pawnName,
      pawnColor,
      pawnPlacement
    };
  };
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
  ///////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////
  getAllPossibleMoves(pawn: Pawn, chessBoard: any[], jsonResponse: any): string[] {
    // console.log('Dostępne pionki w jsonResponse:', jsonResponse);

    let possibleMoves: string[] = [];

    switch (pawn.pawnName) {
      case 'pawn':
        possibleMoves = this.getPawnMoves(pawn, chessBoard, jsonResponse); // MostLikelyWorksProperly
        break;
      case 'rook':
        possibleMoves = this.getRookMoves(pawn, chessBoard, jsonResponse); // MostLikelyWorksProperly
        break;
      case 'knight':
        possibleMoves = this.getKnightMoves(pawn, chessBoard, jsonResponse); // MostLikelyWorksProperly
        break;
      case 'bishop':
        possibleMoves = this.getBishopMoves(pawn, chessBoard, jsonResponse);
        break;
      case 'queen':
        possibleMoves = this.getQueenMoves(pawn, chessBoard, jsonResponse); // MostLikelyWorksProperly
        break;
      case 'king':
        possibleMoves = this.getKingMoves(pawn, chessBoard, jsonResponse);
        break;
      default:
        // console.warn(`Nieznana figura: ${pawn.pawnName}`);
        possibleMoves = [];
    }

    return possibleMoves;
  }

  ///////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////
  getKingMoves(pawn: any, chessBoard: any, jsonResponse: any): string[] {


    // console.log('Rozpoczynamy obliczanie ruchów króla:', pawn);
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
        // console.log(`Sprawdzanie pola docelowego: ${targetSquare}, Ruch: (${rowOffset}, ${colOffset})`);

        if (!square) {
          // console.log(`Pole ${targetSquare} nie zostało odnalezione. Dodajemy do ruchów.`);
          moves.push(targetSquare);
          // console.log(`Aktualna lista ruchów:`, moves);
        } else {
          // console.log(`Czy pole zajęte:`, square);

          if (!square.pawn) {
            moves.push(targetSquare);
          } else if (square.pawn.pawnColor !== pawn.pawnColor) {
            moves.push(targetSquare);
            // console.log(`Dodano pole zajęte przez przeciwnika ${targetSquare}. Aktualna lista ruchów:`, moves);

          }
        }
      }
    }


    if (pawn.pawnName === 'king') {
      const startingPosition = pawn.pawnColor === 'white' ? 'e1' : 'e8';

      const kingPosition = combinedBoard.find((s: any) => s.pawn && s.pawn.pawnName === 'king' && s.pawn.pawnColor === pawn.pawnColor);
      // console.log('Pozycja króla:', kingPosition);

      if (kingPosition && kingPosition.square !== startingPosition) {
        return moves;
      }
      if (pawn.pawnColor === 'white') {
        const rookKRolewska = combinedBoard.find((s: any) => s.square === 'h1' && s.pawn && s.pawn.pawnName === 'rook' && s.pawn.pawnColor === 'white');

        if (rookKRolewska) {
          const f1Occupied = this.isSquareOccupied(combinedBoard, 'f1');
          const g1Occupied = this.isSquareOccupied(combinedBoard, 'g1');


          if (!f1Occupied && !g1Occupied) {
            moves.push('h1');
          }
        }

        const rookHetmańska = combinedBoard.find((s: any) => s.square === 'a1' && s.pawn && s.pawn.pawnName === 'rook' && s.pawn.pawnColor === 'white');

        if (rookHetmańska) {
          const b1Occupied = this.isSquareOccupied(combinedBoard, 'b1');
          const c1Occupied = this.isSquareOccupied(combinedBoard, 'c1');
          const d1Occupied = this.isSquareOccupied(combinedBoard, 'd1');


          if (!b1Occupied && !c1Occupied && !d1Occupied) {
            moves.push('a1');
          }
        }
      } else if (pawn.pawnColor === 'black') {
        const rookKRolewska = combinedBoard.find((s: any) => s.square === 'h8' && s.pawn && s.pawn.pawnName === 'rook' && s.pawn.pawnColor === 'black');

        if (rookKRolewska) {
          const f8Occupied = this.isSquareOccupied(combinedBoard, 'f8');
          const g8Occupied = this.isSquareOccupied(combinedBoard, 'g8');


          if (!f8Occupied && !g8Occupied) {
            moves.push('h8');
          }
        }

        const rookHetmańska = combinedBoard.find((s: any) => s.square === 'a8' && s.pawn && s.pawn.pawnName === 'rook' && s.pawn.pawnColor === 'black');

        if (rookHetmańska) {
          const b8Occupied = this.isSquareOccupied(combinedBoard, 'b8');
          const c8Occupied = this.isSquareOccupied(combinedBoard, 'c8');
          const d8Occupied = this.isSquareOccupied(combinedBoard, 'd8');


          if (!b8Occupied && !c8Occupied && !d8Occupied) {
            moves.push('a8');
          }
        }
      }
    }
    // console.log('Możliwe ruchy króla:', moves);
    return moves;
  }


  isSquareOccupied(board: any, square: string): boolean {
    const targetSquare = board.find((s: any) => s.square === square);
    return targetSquare && targetSquare.pawn !== null;
  }


  getQueenMoves(pawn: any, chessBoard: any, jsonResponse: any): string[] {
    const combinedBoard = chessBoard.map((square: any) => {
      const correspondingPawn = jsonResponse.find((s: any) => s.pawnPlacement === square.square);
      return {
        ...square,
        pawn: correspondingPawn || null
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

        if (square) {
          if (!square.pawn) {
            moves.push(targetSquare);
          } else {
            if (square.pawn.pawnColor !== pawn.pawnColor) {
              moves.push(targetSquare);
            }
            break;
          }
        } else {
          moves.push(targetSquare);
        }
      }
    }

    // console.log('Możliwe ruchy królowej:', moves);
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

        if (square) {
          if (!square.pawn) {
            moves.push(targetSquare);
          } else if (square.pawn) {
            if (square.pawn.pawnColor !== pawn.pawnColor) {
              moves.push(targetSquare);
            }
            break;
          }
        } else {
          moves.push(targetSquare);
        }
      }
    }

    // console.log('Możliwe ruchy bishopa:', moves);
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

        if (square) {
          // console.log(`Znalezione pole: ${targetSquare}, zawartość:`, square);
          if (!square.pawn) {
            moves.push(targetSquare);
            // console.log(`Dodano ruch do: ${targetSquare} (pole puste)`);
          } else if (square.pawn) {
            if (square.pawn.pawnColor !== pawn.pawnColor) {
              moves.push(targetSquare);
              // console.log(`Dodano ruch do: ${targetSquare} (można bić pionka)`);
            }
            break;
          }
        } else {
          moves.push(targetSquare);
          // console.log(`Pole ${targetSquare} nie zostało znalezione w combinedBoard.`);
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

        // console.log(`Sprawdzam pole: ${targetSquare}, Zawartość combinedBoard:`, combinedBoard);

        if (square && square.pawn) {
          // console.log(`Pole ${targetSquare} jest zajęte przez pionka: ${square.pawn.pawnName}, kolor: ${square.pawn.pawnColor}`);

          if (square.pawn.pawnColor === pawn.pawnColor) {
            // console.log(`Pole ${targetSquare} jest zajęte przez swojego pionka, pomijam.`);
            continue;
          }
        } else {
          // console.log(`Pole ${targetSquare} jest puste.`);
        }

        moves.push(targetSquare);
      }
    }

    // console.log('Możliwe ruchy skoczka:', moves);
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
    // console.log('Możliwe ruchy Pionka:', moves);
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