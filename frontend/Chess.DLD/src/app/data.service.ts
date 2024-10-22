import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private baseUrl = 'http://localhost:8080';
  private apiUrlCreateGame = `${this.baseUrl}/game/create-game`;
  private apiUrlMove = (gameId: string) => `${this.baseUrl}/update-game/${gameId}`;
  private apiBoard  = (gameId: string) => `${this.baseUrl}/game/refresh/${gameId}`;
  private apiCreateGame = 'http://localhost:8080/game/create-game'
  private apiTEST  = (gameId: string) => `http://localhost:8080/game-statement/${gameId}`
  private apiLogin = `${this.baseUrl}/login`;
  
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
    const loginData = new HttpParams()
        .set('username', username)
        .set('password', password);

    return this.http.post(this.apiLogin, loginData, {responseType : 'text',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
}


  
  GetTest(gameId: string){
    return this.http.post<any>(this.apiTEST(gameId), {});
  }
}

