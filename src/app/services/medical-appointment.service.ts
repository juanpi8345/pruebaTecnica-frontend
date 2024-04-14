import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MedicalAppointment } from '../models/medical-appointment';
import { MedicalAppointmentDto } from '../models/medical-appointment-dto';

@Injectable({
  providedIn: 'root'
})
export class MedicalAppointmentService {

  constructor(private http:HttpClient) { }

  private apiUrl: string  = "http://localhost:8080/api/appointment/"

  public getAppointment(medicalAppointmentId:number):Observable<MedicalAppointment>{
    return this.http.get<MedicalAppointment>(this.apiUrl+ "get/"+medicalAppointmentId);
  }

  public getAppointments():Observable<MedicalAppointment[]>{
    return this.http.get<MedicalAppointment[]>(this.apiUrl+ "get");
  }

  public getAppointmentsByPatient(patientDni:string):Observable<MedicalAppointment[]>{
    return this.http.get<MedicalAppointment[]>(this.apiUrl+"get/patient/"+patientDni)
  }

  public getAppointmentsByProfessional(professionalDni:string):Observable<MedicalAppointment[]>{
    return this.http.get<MedicalAppointment[]>(this.apiUrl+"get/professional/"+professionalDni)
  }

  public getAppointmentsBySpeciality(specialityName:string):Observable<MedicalAppointment[]>{
    return this.http.get<MedicalAppointment[]>(this.apiUrl+"get/speciality/"+specialityName)
  }

  public addAppointment(medicalAppointment:MedicalAppointmentDto):Observable<any>{
    return this.http.post(this.apiUrl + "add",medicalAppointment);
  }

  public updateAppointment(appointmentId:number, medicalAppointment:MedicalAppointmentDto):Observable<any>{
    return this.http.put(this.apiUrl+"update/"+appointmentId,medicalAppointment)
  }

  public deleteAppointment(medicalAppointmentId:number):Observable<any>{
    return this.http.delete(this.apiUrl+"delete/"+medicalAppointmentId);
  }
}
