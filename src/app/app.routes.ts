import { Routes } from '@angular/router';
import { ConsultingRoomComponent } from './pages/consulting-room/consulting-room.component';
import { SpecialityComponent } from './pages/speciality/speciality.component';
import { PatientComponent } from './pages/patient/patient.component';
import { ProfessionalComponent } from './pages/professional/professional.component';

export const routes: Routes = [
    //{path: '', redirectTo: '/turnos', pathMatch: 'full' },
    {path:'edilicios',component:ConsultingRoomComponent},
    {path:'especialidades',component:SpecialityComponent},
    {path:'pacientes',component:PatientComponent},
    {path:'profesionales',component:ProfessionalComponent}
   // { path: '**', redirectTo: 'turnos', pathMatch:'full'},
];
