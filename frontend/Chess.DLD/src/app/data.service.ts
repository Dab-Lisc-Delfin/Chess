import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://localhost:8080/api/home';
  constructor(private http: HttpClient) {}

  getJsonData(){
    return this.http.post<any>(this.apiUrl, {});
  }
}
