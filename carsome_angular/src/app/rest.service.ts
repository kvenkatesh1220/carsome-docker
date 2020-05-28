import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor(private http: HttpClient) { }

  getSlots(date) {
    console.log(date)
    return this.http.get(`http://localhost:3000/getSlots?date=${date}`);
  }
  
  bookSlot(slot) {
    console.log(slot)
    return this.http.post(`http://localhost:3000/bookSlot`,slot);
  }
}
