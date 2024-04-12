import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ConsultingRoom } from '../../models/consulting-room';
import { ConsultingRoomService } from '../../services/consulting-room.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-consulting-room',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './consulting-room.component.html',
  styleUrl: './consulting-room.component.css'
})
export class ConsultingRoomComponent {

  constructor(private consultingRoomService:ConsultingRoomService){}
  //Observables de las salas.
  consultingRooms$!:Observable<ConsultingRoom[]>;
  //Esta el la sala a agregar
  consultingRoom:ConsultingRoom = new ConsultingRoom();

  ngOnInit():void{
    this.consultingRooms$ = this.consultingRoomService.getConsultingRooms();
  }

  //No utilizo formularios reactivos ya que el formulario solo tiene un campo y
  // no requiere de validaciones complejas
  addRoom():void{
    this.consultingRoomService.addConsultingRoom(this.consultingRoom).subscribe(response=>{
      //Obtengo los edilicios para que se vean los cambios en tiempo real
      this.consultingRooms$ = this.consultingRoomService.getConsultingRooms();
      this.consultingRoom.consultingRoomName = '';
      Swal.fire("Edilicio agregado","El edilicio se agrego correctamente","success");
    },()=>{ Swal.fire("Algo salio mal","Por favor contacte con el administrador","error");})
  }
}
