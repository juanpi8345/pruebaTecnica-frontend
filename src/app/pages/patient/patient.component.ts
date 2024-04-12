import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PatientService } from '../../services/patient.service';
import { Observable } from 'rxjs';
import { Patient } from '../../models/patient';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-patient',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './patient.component.html',
  styleUrl: './patient.component.css'
})
export class PatientComponent {

  constructor(private patientService:PatientService){}
  patients$!:Observable<Patient[]>;
  patient:Patient = new Patient();

  ngOnInit():void{
    this.patients$ = this.patientService.getPatients();
  }
  addPatient():void{
    this.patientService.addPatient(this.patient).subscribe(response=>{
      this.patients$ = this.patientService.getPatients();
      this.patient.name = ''; this.patient.lastname = ''; this.patient.dni = '';
      Swal.fire("Paciente agregado","El paciente se agrego correctamente","success");
    },()=>{ Swal.fire("Algo salio mal","Por favor contacte con el administrador","error");})
  }

}
