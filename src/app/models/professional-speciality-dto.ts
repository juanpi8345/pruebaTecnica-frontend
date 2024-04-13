import { Inject } from "@angular/core";
import { ProfessionalService } from "../services/professional.service";
import { SpecialityService } from "../services/speciality.service";
import { Professional } from "./professional";
import { Speciality } from "./speciality";

export class ProfessionalSpecialityDto {
    dni:string = '';
    specialityName:string = ''
}
