import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DataService } from '../data.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule, HttpClientModule,],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  showModal: boolean = false;
  gameId: string = '';
  imageUrl: string = './BG.png';
  constructor(private router: Router, private dataService: DataService) {}

  createGame() {
    this.dataService.getJsonData().subscribe((response: any) => {
      console.log('Game created:', response);
      this.gameId = response.gameId;
      this.router.navigate([`/game/${this.gameId}`]);
    }, error => {
      console.error('Error creating game:', error);
    });
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
