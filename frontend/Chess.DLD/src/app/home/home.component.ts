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
  constructor(private router: Router, private dataService: DataService) { }
  ngOnInit() {
    console.log(sessionStorage.getItem('playerColor')," wow to ten kolor com mial byc")
    // console.log('on init test')
    this.dataService.getVerification().subscribe(
      (response: any) => {
        // console.log(response)
        // console.log('hej tak sobie sie onInituje')
      },
      (error: any) => {
        console.error(error);
        this.router.navigate(['/login']);
    });
  }
  joinGame() {
    this.showModal = true;
    if (this.gameId) {
      this.router.navigate(['/game', this.gameId]);
      this.closeModal();
    }
  }
  createGame() {
    this.dataService.getJsonData().subscribe((response: any) => {
      this.gameId = response.gameId;
      this.router.navigate([`/game/${this.gameId}`]);
    }, error => {
      console.log(error)
      this.router.navigate([`/login`]);
    });
  }
  
  closeModal() {
    this.showModal = false;
    this.gameId = '';
  }
}
