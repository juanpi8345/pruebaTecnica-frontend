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

@Component({
  selector: 'app-medical-appointment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './medical-appointment.component.html',
  styleUrl: './medical-appointment.component.css'
})
export class MedicalAppointmentComponent {

  //Datepipe para formatear las fechas
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


  ngOnInit(): void {
    this.getAppointments()
    this.getProfessionals();
    this.getPatients();
    this.getConsultingRooms();
  }

  getPatients(): void {
    this.patientService.getPatients().subscribe((patients: Patient[]) => {
      this.patients = patients;
      this.medicalAppointment.patientDni = patients[0].dni;
    })
  }

  getProfessionals(): void {
    this.professionalService.getProfessionals().subscribe((professionals: Professional[]) => {
      this.professionals = professionals;
      this.medicalAppointment.professionalDni = professionals[0].dni;
      //Una vez seteo el dni del profesional, voy a buscar con ese mismo dato sus especialidades
      //Para ofrecerlas en el campo.
      this.getSpecialities();
    })
  }

  getSpecialities(): void {
    this.specialityService.getSpecialitiesByProfessional(this.medicalAppointment.professionalDni)
      .subscribe((specialities: Speciality[]) => {
        this.professionalSpecialities = specialities;
        this.medicalAppointment.specialityName = specialities[0].name;
      })
  }

  getConsultingRooms(): void {
    this.consultingRoomService.getConsultingRooms().subscribe((consultingRooms: ConsultingRoom[]) => {
      this.consultingRooms = consultingRooms;
      this.medicalAppointment.consultingRoomName = consultingRooms[0].consultingRoomName;
    })
  }

  getAppointments(): void {
    this.medicalAppointmentsService.getAppointments()
      .subscribe((medicalAppointments: MedicalAppointment[]) => {
        //Antes de setear los turnos, itero cada uno,formateo la fecha y la remplazo.
        medicalAppointments.forEach(medicalAppointment => {
          medicalAppointment.date = this.datePipe.transform(medicalAppointment.date, 'dd-MM-yyyy HH:mm:ss');
        });
        this.medicalAppointments = medicalAppointments;
      })
  }

  addAppointment(): void {
    console.log(this.medicalAppointment)
    //Formateo la fecha para recibirla correctamente en el backend
    this.medicalAppointment.date = this.datePipe.transform(this.medicalAppointment.date, 'yyyy-MM-ddTHH:mm:ss')
    this.medicalAppointmentsService.addAppointment(this.medicalAppointment).subscribe(response => {
      //No es lo mas recomendable...
      //Pero es mejor que cargar la pagina de nuevo y que realice todas las otras peticiones
      this.getAppointments();
      Swal.fire("Turno agregado", "El turno se agrego correctamente", "success")
    }, err => {
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
        }, err => Swal.fire("No se pudo cancelar", "El turno no se puede cancelar porque queda 1 hora o menos para el mismo", "error"))
      }
    });
  }
}
