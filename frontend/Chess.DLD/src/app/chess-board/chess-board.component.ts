import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-chess-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chess-board.component.html',
  styleUrl: './chess-board.component.css'
})
export class ChessBoardComponent {
  chessBoard:{square: string;color:string;}[]=[
    {square: 'a8', color:'white'},
    {square: 'b8', color:'black'},
    {square: 'c8', color:'white'},
    {square: 'd8', color:'black'},
    {square: 'e8', color:'white'},
    {square: 'f8', color:'black'},
    {square: 'g8', color:'white'},
    {square: 'h8', color:'black'},
    
    {square: 'a7', color:'black'},
    {square: 'b7', color:'white'},
    {square: 'c7', color:'black'},
    {square: 'd7', color:'white'},
    {square: 'e7', color:'black'},
    {square: 'f7', color:'white'},
    {square: 'g7', color:'black'},
    {square: 'h7', color:'white'},

    {square: 'a6', color:'white'},
    {square: 'b6', color:'black'},
    {square: 'c6', color:'white'},
    {square: 'd6', color:'black'},
    {square: 'e6', color:'white'},
    {square: 'f6', color:'black'},
    {square: 'g6', color:'white'},
    {square: 'h6', color:'black'},

    {square: 'a5', color:'black'},
    {square: 'b5', color:'white'},
    {square: 'c5', color:'black'},
    {square: 'd5', color:'white'},
    {square: 'e5', color:'black'},
    {square: 'f5', color:'white'},
    {square: 'g5', color:'black'},
    {square: 'h5', color:'white'},

    {square: 'a4', color:'white'},
    {square: 'b4', color:'black'},
    {square: 'c4', color:'white'},
    {square: 'd4', color:'black'},
    {square: 'e4', color:'white'},
    {square: 'f4', color:'black'},
    {square: 'g4', color:'white'},
    {square: 'h4', color:'black'},

    {square: 'a3', color:'black'},
    {square: 'b3', color:'white'},
    {square: 'c3', color:'black'},
    {square: 'd3', color:'white'},
    {square: 'e3', color:'black'},
    {square: 'f3', color:'white'},
    {square: 'g3', color:'black'},
    {square: 'h3', color:'white'},

    {square: 'a2', color:'white'},
    {square: 'b2', color:'black'},
    {square: 'c2', color:'white'},
    {square: 'd2', color:'black'},
    {square: 'e2', color:'white'},
    {square: 'f2', color:'black'},
    {square: 'g2', color:'white'},
    {square: 'h2', color:'black'},

    {square: 'a1', color:'black'},
    {square: 'b1', color:'white'},
    {square: 'c1', color:'black'},
    {square: 'd1', color:'white'},
    {square: 'e1', color:'black'},
    {square: 'f1', color:'white'},
    {square: 'g1', color:'black'},
    {square: 'h1', color:'white'},
  ]

}
