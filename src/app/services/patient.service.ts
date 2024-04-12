import { Injectable } from '@angular/core';
import { Patient } from '../models/patient';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  constructor(private http:HttpClient){}

  private apiUrl: string  = "http://localhost:8080/api/patient/"

  public getPatients():Observable<Patient[]>{
    return this.http.get<Patient[]>(this.apiUrl+ "get");
  }


  public addPatient(patient:Patient):Observable<any>{
    return this.http.post<Patient>(this.apiUrl + "add",patient);
  }
}
