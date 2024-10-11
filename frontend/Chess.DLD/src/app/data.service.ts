import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://localhost:8080/api/start-game';
  private apiUrlMove = 'http://localhost:8080/api/make-move';
  constructor(private http: HttpClient) {}

  getJsonData(){
    return this.http.post<any>(this.apiUrl, {});
  }
  sendMoveDetails(moveDetails: any) {
    return this.http.post(this.apiUrlMove, moveDetails);
  }
  GetBoardDetails(moveDetails: any) {
    return this.http.post(this.apiUrlMove, moveDetails);
  }
}
