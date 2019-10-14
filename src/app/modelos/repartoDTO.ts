import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';
@Injectable()
//Define la entidad de la base de datos. Modelo para Diálogo ‘Planillas Cerradas’ 
export class RepartoDTO {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            idReparto: new FormControl(),
            idEmpresa: new FormControl(),
            esRepartoPropio: new FormControl('', Validators.required), //En Diálogo ‘Planillas Cerradas’  Campo ‘Tipo Viaje’
            fechaDesde: new FormControl('', Validators.required),
            fechaHasta: new FormControl('', Validators.required),
            idChofer: new FormControl('', Validators.required),
            estaCerrada: new FormControl(),
        });
    }
}