import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private baseUrl = 'http://localhost:8080';
  private apiUrlCreateGame = `${this.baseUrl}/game/create-game`;
  private apiUrlMove = (gameId: string) => `${this.baseUrl}/update-game/${gameId}`;
  private apiBoard  = (gameId: string) => `${this.baseUrl}/game/refresh/${gameId}`;
  private apiCreateGame = 'http://localhost:8080/game/create-game'
  private apiTEST  = (gameId: string) => `http://localhost:8080/api/game-statement/${gameId}`
  private apiLogin = `${this.baseUrl}/game/login`;
  
  constructor(private http: HttpClient) {}

  getJsonData() {
    return this.http.post<any>(this.apiUrlCreateGame, {});
  }
  sendMoveDetails(moveDetails: any, gameId: string) {
    console.log('Move details:', moveDetails);
    console.log(this.apiUrlMove)
    return this.http.post(this.apiUrlMove(gameId), moveDetails);
  }
  
  GetBoardDetails(gameId: string) {
    return this.http.post<any>(this.apiBoard(gameId), {});
  }
  GetGameId() {
    return this.http.post<any>(this.apiCreateGame, {});
  }
  GetLogin(username: string, password: string) {
    const loginData = { username, password };
    return this.http.post<any>(this.apiLogin,loginData, {});
  }
  GetTest(gameId: string){
    return this.http.post<any>(this.apiTEST(gameId), {});
  }
}

