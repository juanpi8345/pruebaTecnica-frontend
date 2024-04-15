import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { SpecialityService } from '../../services/speciality.service';
import { Observable } from 'rxjs';
import { Speciality } from '../../models/speciality';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-speciality',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './speciality.component.html',
  styleUrl: './speciality.component.css'
})
export class SpecialityComponent {

  constructor(private specialityService:SpecialityService){}
  specialities$!:Observable<Speciality[]>;
  speciality:Speciality = new Speciality();

  ngOnInit():void{
    this.specialities$ = this.specialityService.getSpecialities();
  }

  addRoom():void{
    if(this.speciality.name == undefined){
      Swal.fire("Campos incompletos","Por favor completa los campos de manera correcta","warning");
      return;
    }
    this.specialityService.addSpeciality(this.speciality).subscribe(response=>{
      this.specialities$ = this.specialityService.getSpecialities();
      this.speciality.name = '';
      Swal.fire("Especialidad agregada","La especialidad se agrego correctamente","success");
    },()=>{ Swal.fire("Algo salio mal","Por favor contacte con el administrador","error");})
  }

}
