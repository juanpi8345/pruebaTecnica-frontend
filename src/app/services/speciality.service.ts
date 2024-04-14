import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Speciality } from '../models/speciality';

@Injectable({
  providedIn: 'root'
})
export class SpecialityService {

  constructor(private http:HttpClient) { }

  private apiUrl: string  = "http://localhost:8080/api/speciality/"

  public getSpecialities():Observable<Speciality[]>{
    return this.http.get<Speciality[]>(this.apiUrl+ "get");
  }

  public getSpecialitiesByProfessional(professionalDni:string):Observable<Speciality[]>{
    return this.http.get<Speciality[]>(this.apiUrl+ "get/professional/"+professionalDni);
  }

  public addSpeciality(speciality:Speciality):Observable<any>{
    return this.http.post(this.apiUrl + "add",speciality);
  }
}

