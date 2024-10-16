import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  showModal: boolean = false;
  gameId: string = '';
  imageUrl: string = './BG.png';
  constructor(private router: Router) {}
  createGame() {
    const gameId = Math.random().toString(36).substring(2, 10);

    this.router.navigate([`/game/${gameId}`]);
  }
  joinGame() {
    this.showModal = true;
    if (this.gameId) {
      this.router.navigate(['/game', this.gameId]);
      this.closeModal();
    }
  }
  closeModal() {
    this.showModal = false;
    this.gameId = '';
  }
}
