import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://localhost:8080/api/start-game';
  private apiUrlMove = 'http://localhost:8080/api/make-move';
  private apiBoard = 'http://localhost:8080/api/game-statement';

  constructor(private http: HttpClient) {}
  // BoardCount: number = 0;
  // SendCount: number = 0;

  getJsonData(){
    return this.http.post<any>(this.apiUrl, {});
  }
  sendMoveDetails(moveDetails: any) {
    // this.SendCount++;
    // console.log(`Move details sent ${this.SendCount} times.`);
    return this.http.post(this.apiUrlMove, moveDetails);
  }
  GetBoardDetails(moveDetails: any) {
    // this.BoardCount++;
    // console.log(`Board details sent ${this.BoardCount} times.`);
    return this.http.post(this.apiBoard, moveDetails);
  }
}
