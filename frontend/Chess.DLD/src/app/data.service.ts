import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://localhost:8080/game/create-game';
  private apiUrlMove = 'http://localhost:8080/api/make-move';
  private apiBoard = 'http://localhost:8080/api/game-statement';
  private apiCreateGame = 'http://localhost:8080/game/create-game'
  private apiLogin = 'http://localhost:8080/game/login'
  constructor(private http: HttpClient) {}

  getJsonData(){
    return this.http.post<any>(this.apiUrl, {});
  }
  sendMoveDetails(moveDetails: any) {
    return this.http.post(this.apiUrlMove, moveDetails, {
      responseType: 'text'
    });
  }
  GetBoardDetails() {
    return this.http.post<any>(this.apiBoard, {});
  }
  GetGameId() {
    return this.http.post<any>(this.apiCreateGame, {});
  }
  GetLogin(username: string, password: string) {
    const loginData = { username, password };
    return this.http.post<any>(this.apiLogin, {responseType:'text'});
  }
}
