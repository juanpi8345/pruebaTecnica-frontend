import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProfessionalService } from '../../services/professional.service';
import { Professional } from '../../models/professional';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { Speciality } from '../../models/speciality';
import { SpecialityService } from '../../services/speciality.service';
import { ProfessionalSpecialityDto } from '../../models/professional-speciality-dto';

@Component({
  selector: 'app-professional',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './professional.component.html',
  styleUrl: './professional.component.css'
})
export class ProfessionalComponent {

  constructor(private professionalService:ProfessionalService,
              private specialityService:SpecialityService){}
  // No utilizo observables para hacer async en el html.
  // Voy a necesitar de esta informacion
  // Para ambos formularios
  professionals:Professional[] = [];
  specialities:Speciality[] = [];
  //Profesional  crea el usuario
  professional:Professional = new Professional();
  //Dto para ingresar el dni del profesional y el nombre de la especialidad
  professionalSpeciality:ProfessionalSpecialityDto = new ProfessionalSpecialityDto();

  ngOnInit():void{
    this.getProfessionals();
    this.getSpecialities();
    this.professionalSpeciality.dni = this.professionals[0].dni;
   
  }
  addProfessional():void{
    if(!this.validateAddProfessional())
      return;
    this.professionalService.addProfessional(this.professional).subscribe(response=>{
      //Creo una nueva instancia de profesional para evitar errores
      //Pusheo a la lista de profesionales el profesional asi se ve en tiempo real
      const newProfessional: Professional = {
        name: this.professional.name,
        lastname: this.professional.lastname,
        dni: this.professional.dni,
        start: this.professional.start,
        end: this.professional.end,
        specialityList: []
      };
      this.professionals.push(newProfessional);
      //Limpio los campos asi se borran del form.
      this.professional.name = ''; this.professional.lastname = ''; this.professional.dni = '';
      this.professional.start = null; this.professional.end = null;
      Swal.fire("Profesional agregado","El profesional se agrego correctamente","success");
    },err=>{
      if(err.status == 406){
        Swal.fire("Clinica fuera de servicio","El profesional no se agrego porque la clinica esta fuera de servicio en ese horario","error");
      }else if(err.status == 400){
        Swal.fire("Horarios incorrectos","Por favor revisa los horarios del profesional","error");
      }
    })
  }

  addSpeciality(){
    this.professionalService.addSpeciality(this.professionalSpeciality.dni,
      this.professionalSpeciality.specialityName).subscribe(response=>{
        const speciality: Speciality = {
          name: this.professionalSpeciality.specialityName
        };
        //Busco el indice donde se encuentra el profesional, comparando por el dni.
        const index = this.professionals.findIndex(professional => professional.dni === this.professionalSpeciality.dni);
        //En el index donde se encuentra, pusheo en su lista de especialidades, la especialidad.
        this.professionals[index].specialityList.push(speciality);
        Swal.fire("Especialidad asignada","La especialidad "+speciality.name+ " se asigno correctamente","success");
      },()=>{ Swal.fire("Algo salio mal","Por favor contacte con el administrador","error");})
  }

  getProfessionals(){
    this.professionalService.getProfessionals().subscribe((professionals:Professional[])=>{
      this.professionals = professionals;
      //Seteo el primer dni del profesional al campo formulario para agregar especialidad
      //Esto para que el usuario no puede enviar campos vacios
      this.professionalSpeciality.dni = professionals[0].dni;
    },()=>{ Swal.fire("Algo salio mal","Por favor contacte con el administrador","error");})
  }

  getSpecialities(){
    this.specialityService.getSpecialities().subscribe((specialities:Speciality[])=>{
      this.specialities = specialities;
      //Seteo el primer nombre de la especialidad al campo formulario para agregar especialidad
      //Esto para que el usuario no puede enviar campos vacios
      this.professionalSpeciality.specialityName = specialities[0].name;
    },()=>{ Swal.fire("Algo salio mal","Por favor contacte con el administrador","error");})
  }

  //Aux
  //Hago otro metodo porque tiene un poco mas de complejidad
  validateAddProfessional():boolean{
    if(this.professional.dni == undefined || this.professional.end == undefined 
      || this.professional.start == undefined || this.professional.name == undefined
      || this.professional.lastname == undefined){
        Swal.fire("Campos incompletos","Por favor completa los campos de manera correcta","warning");
        return false;
      }
      return true;
  }
}
