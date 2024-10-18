import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DataService } from './data.service';
import { ChessBoardComponent } from './chess-board/chess-board.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HttpClientModule, ChessBoardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Chess.DLD';
  tailwindMessage = 'TailwindWorks';
  showGame = false;
  test = false;
  Board = true;
  // jsonResponse: any;

  toggleGameDisplay() {
    this.showGame = !this.showGame;
  }


}