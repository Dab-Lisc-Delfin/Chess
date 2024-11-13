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
  playersRankingList: any[] = [];
  constructor(private router: Router, private dataService: DataService) { }
  ngOnInit() {
    localStorage.removeItem('Color');
    localStorage.removeItem('Username');
    this.dataService.getVerification().subscribe(
      (response: any) => {
        this.getRanking();
        // console.log(response, "!response!")
      },
      (error: any) => {
        this.router.navigate(['/login']);
        console.log(error, "!error!")
    });
  }
  getRanking(){
    this.dataService.getRankingData().subscribe((response:any)=>{
      if(response){
        this.playersRankingList = response.playersRankingList;
      }else (error:any) =>{
      }
    })
  }
  logout(){
    this.dataService.getLogout().subscribe((response:any)=>{
      this.router.navigate([`/login`]);


    }, error =>{
      this.router.navigate([`/login`]);
    })
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
      if(response){
        this.gameId = response.gameId;
        this.router.navigate([`/game/${this.gameId}`]);
      }
      }, 
      error => {
        // this.router.navigate([`/login`]);
      }
    );
  }
  
  
  closeModal() {
    this.showModal = false;
    this.gameId = '';
  }
}
