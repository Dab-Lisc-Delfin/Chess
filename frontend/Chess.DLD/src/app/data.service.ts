import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private baseUrl = 'http://localhost:8080';
  private apiUrlCreateGame = `${this.baseUrl}/game/create-game`;
  private apiUrlMove = (gameId: string) => `${this.baseUrl}/update-game/${gameId}`;
  private apiBoard = (gameId: string) => `${this.baseUrl}/game/refresh/${gameId}`;
  private apiCreateGame = 'http://localhost:8080/game/create-game'
  private apiTEST = (gameId: string) => `http://localhost:8080/game-statement/${gameId}`
  private apiLogin = `${this.baseUrl}/login`;
  private apiRegister = `${this.baseUrl}/api/create-user`;
  private apiVerify = `${this.baseUrl}/api/verify-user`;
  private apiJoinGame = (gameId: string) => `${this.baseUrl}/api/join-game/${gameId}`;

  constructor(private http: HttpClient) { }

  getJsonData() {
    return this.http.post<any>(this.apiUrlCreateGame, {});
  }
  GetJoinData(gameId: string) {
    return this.http.post<any>(this.apiJoinGame(gameId), {});
  }
  getVerification() {
    return this.http.post<any>(this.apiVerify, {});
  }
  sendMoveDetails(moveDetails: any, gameId: string) {
    return this.http.post(this.apiUrlMove(gameId), moveDetails);
  }

  GetBoardDetails(gameId: string) {
    return this.http.post<any>(this.apiBoard(gameId), {});
  }
  GetGameId() {
    return this.http.post<any>(this.apiCreateGame, {});
  }
  GetLogin(username: string, password: string) {

    const loginData = new HttpParams()
      .set('username', username)
      .set('password', password);

    return this.http.post(this.apiLogin, loginData, {
      responseType: 'text',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  }
  GetRegister(username: string, password: string, email: string) {
    const RegisterData = { username, email, password };
    return this.http.post(this.apiRegister, RegisterData, { responseType: 'text' });
  }


  GetTest(gameId: string) {
    return this.http.post<any>(this.apiTEST(gameId), {});
  }
}

