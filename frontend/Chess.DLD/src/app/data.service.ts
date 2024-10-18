import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private baseUrl = 'http://localhost:8080';
  private apiUrlCreateGame = `${this.baseUrl}/game/create-game`;
  private apiUrlMove = (gameId: string) => `${this.baseUrl}/ws/game/update-game/${gameId}`;
  private apiBoard = `${this.baseUrl}/api/game-statement`;
  private apiCreateGame = 'http://localhost:8080/game/create-game'
  private apiLogin = `${this.baseUrl}/game/login`;
  
  constructor(private http: HttpClient) {}

  getJsonData() {
    return this.http.post<any>(this.apiUrlCreateGame, {});
  }
  sendMoveDetails(moveDetails: any, gameId: string) {
    return this.http.post(this.apiUrlMove(gameId), moveDetails, {
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
    return this.http.post<any>(this.apiLogin,loginData, {});
  }
}
