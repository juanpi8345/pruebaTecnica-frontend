import { Routes } from '@angular/router';
import { ConsultingRoomComponent } from './pages/consulting-room/consulting-room.component';
import { SpecialityComponent } from './pages/speciality/speciality.component';

export const routes: Routes = [
    //{path: '', redirectTo: '/turnos', pathMatch: 'full' },
    {path:'edilicios',component:ConsultingRoomComponent},
    {path:'especialidades',component:SpecialityComponent},
   // { path: '**', redirectTo: 'turnos', pathMatch:'full'},
];
