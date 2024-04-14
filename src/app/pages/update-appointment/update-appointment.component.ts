import { Component } from '@angular/core';
import { MedicalAppointmentService } from '../../services/medical-appointment.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MedicalAppointment } from '../../models/medical-appointment';
import { MedicalAppointmentDto } from '../../models/medical-appointment-dto';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Patient } from '../../models/patient';
import { Professional } from '../../models/professional';
import { ConsultingRoom } from '../../models/consulting-room';
import { Speciality } from '../../models/speciality';
import { PatientService } from '../../services/patient.service';
import { SpecialityService } from '../../services/speciality.service';
import { ConsultingRoomService } from '../../services/consulting-room.service';
import { ProfessionalService } from '../../services/professional.service';

@Component({
  selector: 'app-update-appointment',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterLink],
  templateUrl: './update-appointment.component.html',
  styleUrl: './update-appointment.component.css'
})
export class UpdateAppointmentComponent {
  constructor(private medicalAppointmentService: MedicalAppointmentService,
    private route: ActivatedRoute, private router:Router,
    private patientService: PatientService,
    private professionalService:ProfessionalService,
    private specialityService: SpecialityService,
    private consultingRoomService: ConsultingRoomService,
    private medicalAppointmentsService: MedicalAppointmentService,
    private datePipe:DatePipe) { }

  //Con esta variable voy a realizar la peticion get para obtener los datos
  //de el turno, esto para autocompletar el formulario y que el usuario
  //solo tenga que cambiar las cosas que desee
  medicalAppointmentId: number;
  medicalAppointment: MedicalAppointmentDto = new MedicalAppointmentDto();

  patients: Patient[] = [];
  professionals: Professional[] = [];
  professionalSpecialities: Speciality[] = [];
  consultingRooms: ConsultingRoom[] = [];

  ngOnInit(): void {
    this.getPatients();
    this.getProfessionals();
    this.getConsultingRooms();
    //Obtengo el id de el turno, gracias a la url
    this.medicalAppointmentId = this.route.snapshot.params['medicalAppointmentId'];
    //Si se envia una url vacia se redirige
    if(this.medicalAppointmentId == null){
      this.router.navigate(['/turnos']);
      return;
    }
    this.medicalAppointmentService.getAppointment(this.medicalAppointmentId).
      subscribe((medicalAppointment: MedicalAppointment) => {
        console.log(medicalAppointment)
        this.medicalAppointment = medicalAppointment;
      },err=>{
        Swal.fire("Ocurrio un error","Error al obtener el turno a modificar","error")
        this.router.navigate(['/turnos']);
      })
  }

  getPatients(): void {
    this.patientService.getPatients().subscribe((patients: Patient[]) => {
      this.patients = patients;
      //Seteos ambos campos de los forms para que no queden vacios.
      this.medicalAppointment.patientDni = patients[0].dni;
    })
  }

  getProfessionals(): void {
    this.professionalService.getProfessionals().subscribe((professionals: Professional[]) => {
      this.professionals = professionals;
      //Seteos ambos campos de los forms para que no queden vacios.
      this.medicalAppointment.professionalDni = professionals[0].dni;
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
      })
  }

  getConsultingRooms(): void {
    this.consultingRoomService.getConsultingRooms().subscribe((consultingRooms: ConsultingRoom[]) => {
      this.consultingRooms = consultingRooms;
      this.medicalAppointment.consultingRoomName = consultingRooms[0].consultingRoomName;
    })
  }

  updateAppointment(): void {
    console.log(this.medicalAppointment)
    //Formateo la fecha para recibirla correctamente en el backend
    this.medicalAppointment.date = this.datePipe.transform(this.medicalAppointment.date, 'yyyy-MM-ddTHH:mm:ss')
    this.medicalAppointmentsService.updateAppointment(this.medicalAppointmentId,this.medicalAppointment).subscribe(response => {
      Swal.fire("Turno modificado", "El turno se modificado correctamente", "success")
      this.router.navigate(['/turnos'])
    }, err => {
      if(err.status == 400)
        Swal.fire("No se pudo modificar", "El turno no se pudo modificar porque el profesional no atiende a esa hora", "error")
      else if(err.status == 406)
        Swal.fire("No se pudo modificar", "El turno no se pudo modificar porque la clinica esta fuera de servicio", "error")
    })
  }




}
