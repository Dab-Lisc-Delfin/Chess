import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GameComponent } from './game/game.component';
import { TestComponent } from './test/test.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DataService } from './data.service';
import { ChessBoardComponent } from './chess-board/chess-board.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GameComponent, CommonModule,HttpClientModule, TestComponent,ChessBoardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Chess.DLD';
  tailwindMessage = 'TailwindWorks';
  showGame = false;
  test = false;
  Board = true;
  jsonResponse: any;

  toggleGameDisplay() {
    this.showGame = !this.showGame;
  }
  constructor(private dataService: DataService) {
    this.dataService.getJsonData().subscribe(
      (res: any) => {
        this.jsonResponse = res; 
        alert(JSON.stringify(res));
      },
      (error) => {
        console.error('Error fetching JSON data:', error);
      }
    );
  }
}