import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConsultingRoom } from '../models/consulting-room';

@Injectable({
  providedIn: 'root'
})
export class ConsultingRoomService {

  constructor(private http:HttpClient) { }

  private apiUrl: string  = "http://localhost:8080/api/consultingRoom/"

  public getConsultingRooms():Observable<ConsultingRoom[]>{
    return this.http.get<ConsultingRoom[]>(this.apiUrl+ "get");
  }

  public addConsultingRoom(consultingRoom:ConsultingRoom):Observable<any>{
    return this.http.post<ConsultingRoom>(this.apiUrl + "add",consultingRoom);
  }
}
