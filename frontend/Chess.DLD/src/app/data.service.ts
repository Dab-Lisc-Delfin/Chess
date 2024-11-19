import { Injectable } from '@angular/core';
import { HttpClient, HttpParams,HttpHeaders } from '@angular/common/http';

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
  private apiEndGame = (gameId: string) => `${this.baseUrl}/api/game-finish/${gameId}`;
  private apiLogout = `${this.baseUrl}/logout`;
  private apiRanking = `${this.baseUrl}/api/players-ranking`;

  constructor(private http: HttpClient) { }

  getJsonData() {
    return this.http.post<any>(this.apiUrlCreateGame, {}, { withCredentials: true });
  }

  GetJoinData(gameId: string) {
    return this.http.post<any>(this.apiJoinGame(gameId), {}, { withCredentials: true });
  }

  getVerification() {
    return this.http.post<any>(this.apiVerify, {}, { withCredentials: true });
  }

  sendMoveDetails(moveDetails: any, gameId: string) {
    return this.http.post(this.apiUrlMove(gameId), moveDetails, { withCredentials: true });
  }

  GetBoardDetails(gameId: string) {
    return this.http.post<any>(this.apiBoard(gameId), {}, { withCredentials: true });
  }

  GetGameId() {
    return this.http.post<any>(this.apiCreateGame, {}, { withCredentials: true });
  }

  GetLogin(username: string, password: string) {
    const loginData = new HttpParams()
      .set('username', username)
      .set('password', password);

    return this.http.post(this.apiLogin, loginData, {
      responseType: 'text',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      withCredentials: true
    });
  }

  GetRegister(username: string, password: string, email: string) {
    const RegisterData = { username, email, password };
    return this.http.post(this.apiRegister, RegisterData, { responseType: 'text', withCredentials: true });
  }
  GetFinish(gameId: string,color:any) {
    const body = { color: color };
    return this.http.post<any>(this.apiEndGame(gameId),body,{
      responseType: 'text' as 'json',
      // headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      withCredentials: true
    });
  }

getRankingData(){
    return this.http.post<any>(this.apiRanking,{
      responseType: 'text',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      withCredentials: true 
    });
  }
getLogout() {
    return this.http.post<any>(this.apiLogout, {
      responseType: 'text',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      withCredentials: true 
    });
  }
  GetTest(gameId: string) {
    return this.http.post<any>(this.apiTEST(gameId), {}, { withCredentials: true });
  }
}
