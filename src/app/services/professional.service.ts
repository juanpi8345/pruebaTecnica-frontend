import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Professional } from '../models/professional';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfessionalService {

  constructor(private http:HttpClient){}

  private apiUrl: string  = "http://localhost:8080/api/professional/"

  public getProfessionals():Observable<Professional[]>{
    return this.http.get<Professional[]>(this.apiUrl+ "get");
  }

  public addProfessional(professional:Professional):Observable<any>{
    return this.http.post(this.apiUrl + "add",professional);
  }

  public addSpeciality(professionalDni:string,specialityName:string):Observable<any>{
    return this.http.post(this.apiUrl + professionalDni+"/add/speciality/"+specialityName,null);
  }
}
