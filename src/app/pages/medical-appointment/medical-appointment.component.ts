import { Component } from '@angular/core';
import { Professional } from '../../models/professional';
import { Speciality } from '../../models/speciality';
import { ConsultingRoom } from '../../models/consulting-room';
import { Patient } from '../../models/patient';
import Swal from 'sweetalert2';
import { ProfessionalService } from '../../services/professional.service';
import { MedicalAppointmentDto } from '../../models/medical-appointment-dto';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatientService } from '../../services/patient.service';
import { SpecialityService } from '../../services/speciality.service';
import { ConsultingRoomService } from '../../services/consulting-room.service';
import { MedicalAppointmentService } from '../../services/medical-appointment.service';
import { MedicalAppointment } from '../../models/medical-appointment';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-medical-appointment',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './medical-appointment.component.html',
  styleUrl: './medical-appointment.component.css'
})
export class MedicalAppointmentComponent {

  //DatePipe para formatear las fechas
  constructor(private professionalService: ProfessionalService,
    private patientService: PatientService,
    private specialityService: SpecialityService,
    private consultingRoomService: ConsultingRoomService,
    private medicalAppointmentsService: MedicalAppointmentService,
    private datePipe: DatePipe) { }

  patients: Patient[] = [];
  professionals: Professional[] = [];
  professionalSpecialities: Speciality[] = [];
  consultingRooms: ConsultingRoom[] = [];
  medicalAppointments: MedicalAppointment[] = [];

  //Objeto a enviar en el formulario
  //Como voy a usar ngModel los voy a inicializar en cada get con el primer valor clave.
  //Asi no empiezan en blanco.
  medicalAppointment: MedicalAppointmentDto = new MedicalAppointmentDto();

  //Campos que voy a usar para el filtrado
  patientDniToFilter: string;
  professionalDniToFilter:string;
  specialityNameToFilter : string;

  //Necesito este campo porque el anterior de especialidad dependia del profesional
  specialities:Speciality[] = [];

  ngOnInit(): void {
    this.getAllAppointments()
    this.getProfessionals();
    this.getPatients();
    this.getConsultingRooms();
    this.getAllSpecialities();
  }

  getPatients(): void {
    this.patientService.getPatients().subscribe((patients: Patient[]) => {
      this.patients = patients;
      //Seteos ambos campos de los forms para que no queden vacios.
      this.medicalAppointment.patientDni = patients[0].dni;
      this.patientDniToFilter = patients[0].dni;
    })
  }

  getProfessionals(): void {
    this.professionalService.getProfessionals().subscribe((professionals: Professional[]) => {
      this.professionals = professionals;
      //Seteos ambos campos de los forms para que no queden vacios.
      this.medicalAppointment.professionalDni = professionals[0].dni;
      this.professionalDniToFilter =professionals[0].dni;
      //Una vez seteo el dni del profesional, voy a buscar con ese mismo dato sus especialidades
      //Para ofrecerlas en el campo.
      this.getSpecialitiesByProfessional();
    })
  }

  getSpecialitiesByProfessional(): void {
    this.specialityService.getSpecialitiesByProfessional(this.medicalAppointment.professionalDni)
      .subscribe((specialities: Speciality[]) => {
        this.professionalSpecialities = specialities;
         //Seteos ambos campos de los forms para que no queden vacios.
        this.medicalAppointment.specialityName = specialities[0].name;
        this.specialityNameToFilter = specialities[0].name;
      })
  }

  getAllSpecialities(){
    this.specialityService.getSpecialities().subscribe((specialities:Speciality[])=>{
      this.specialities = specialities;
    })
  }

  getConsultingRooms(): void {
    this.consultingRoomService.getConsultingRooms().subscribe((consultingRooms: ConsultingRoom[]) => {
      this.consultingRooms = consultingRooms;
      this.medicalAppointment.consultingRoomName = consultingRooms[0].consultingRoomName;
    })
  }

  getAllAppointments(): void {
    this.medicalAppointmentsService.getAppointments()
      .subscribe((medicalAppointments: MedicalAppointment[]) => {
        this.medicalAppointments = this.formatDates(medicalAppointments);
      })
  }

  getAppointmentsByPatient():void{
    this.medicalAppointmentsService.getAppointmentsByPatient(this.patientDniToFilter).
                  subscribe((medicalAppointments:MedicalAppointment[])=>{
                    //Actualizo la lista que se muestra en la tabla con sus fechas formateadas
                    this.medicalAppointments = this.formatDates(medicalAppointments);
    })
  }

  getAppointmentsByProfessional():void{
    this.medicalAppointmentsService.getAppointmentsByProfessional(this.professionalDniToFilter)
                .subscribe((medicalAppointments:MedicalAppointment[])=>{
                   //Actualizo la lista que se muestra en la tabla con sus fechas formateadas
                   this.medicalAppointments = this.formatDates(medicalAppointments);
    })
  }

  getAppointmentsBySpeciality():void{
    this.medicalAppointmentsService.getAppointmentsBySpeciality(this.specialityNameToFilter)
                .subscribe((medicalAppointments:MedicalAppointment[])=>{
                    //Actualizo la lista que se muestra en la tabla con sus fechas formateadas
                   this.medicalAppointments = this.formatDates(medicalAppointments);
                })
  }


  addAppointment(): void {
    if(!this.validateAppointment())
      return;
    //Formateo la fecha para recibirla correctamente en el backend
    this.medicalAppointment.date = this.datePipe.transform(this.medicalAppointment.date, 'yyyy-MM-ddTHH:mm:ss')
    this.medicalAppointmentsService.addAppointment(this.medicalAppointment).subscribe(response => {
      //Obtengo de vuelta las citas medicas.
      this.getAllAppointments();
      Swal.fire("Turno agregado", "El turno se agrego correctamente", "success")
    }, err => {
      if(err.status == 400)
        Swal.fire("No se pudo otorgar", "El turno no se pudo otorgar porque el profesional no atiende a esa hora", "error")
      else if(err.status == 406)
        Swal.fire("No se pudo otorgar", "El turno no se pudo otorgar porque la clinica esta fuera de servicio", "error")
    })
  }

  deleteAppointment(medicalAppointmentId: number): void {
    Swal.fire({
      title: 'Eliminar turno',
      text: '¿Esta seguro que quiere eliminar el turno?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      //Si el usuario confirma la accion se llama al servicio y elimina
      if (result.isConfirmed) {
        this.medicalAppointmentsService.deleteAppointment(medicalAppointmentId).subscribe(response => {
          Swal.fire("Turno eliminado", "El turno se elimino correctamente", "success");
          //Filtro la lista, obtengo todos los resultados que tengan ids distintos al eliminado
          //Esto para obtener cambios en tiempo real
          this.medicalAppointments = this.medicalAppointments.filter((medicalAppointment) => {
            return medicalAppointment.medicalAppointmentId !== medicalAppointmentId;
          });
        }, err => {
          if(err.status == 400){
            Swal.fire("No se pudo cancelar", "El turno no se puede cancelar porque queda 1 hora o menos para el mismo", "error")
          }
        })
      }
    });
  }

  //Aux
  //Este metodo recibe una lista de turnos, y los devuelve pero con sus fechas formateadas
  formatDates(medicalAppointments:MedicalAppointment[]):MedicalAppointment[]{
    medicalAppointments.forEach(medicalAppointment => {
      medicalAppointment.date = this.datePipe.transform(medicalAppointment.date, 'dd-MM-yyyy HH:mm:ss');
    });
    return medicalAppointments;
  }

  validateAppointment():boolean{
    if(this.medicalAppointment.consultingRoomName == undefined ||
      this.medicalAppointment.date == undefined || this.medicalAppointment.patientDni == undefined
      || this.medicalAppointment.professionalDni == undefined || this.medicalAppointment.specialityName == null
    ){
      Swal.fire("Campos incompletos","Por favor completa los campos de manera correcta","warning");
      return false;
    }
    return true;
  }

 
}
