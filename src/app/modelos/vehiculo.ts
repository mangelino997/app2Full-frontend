import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Pdf } from './pdf';
import { Injectable } from '@angular/core';
//Define la entidad de la base de datos.
@Injectable()
export class Vehiculo {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //define el formulario de la clase PDf
    public pdfFormulario: FormGroup;
    //constructor
    constructor(private pdf: Pdf) {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            configuracionVehiculo: new FormControl('', Validators.required),
            dominio: new FormControl('', [Validators.required, Validators.maxLength(10)]),
            numeroInterno: new FormControl('', Validators.maxLength(5)),
            localidad: new FormControl('', Validators.required),
            anioFabricacion: new FormControl('', [Validators.required, Validators.min(1), Validators.maxLength(4)]),
            numeroMotor: new FormControl('', [Validators.required, Validators.maxLength(25)]),
            numeroChasis: new FormControl('', [Validators.maxLength(25)]),
            empresa: new FormControl('', Validators.required),
            personal: new FormControl(),
            vehiculoRemolque: new FormControl(),
            companiaSeguroPoliza: new FormControl('', Validators.required),
            vtoRTO: new FormControl('', Validators.required),
            // numeroRuta: new FormControl('', [Validators.required, Validators.maxLength(15)]),
            vtoRuta: new FormControl('', Validators.required),
            vtoSenasa: new FormControl(),
            vtoHabBromatologica: new FormControl(),
            usuarioAlta: new FormControl(),
            fechaAlta: new FormControl(),
            usuarioBaja: new FormControl(),
            fechaBaja: new FormControl(),
            usuarioMod: new FormControl(),
            fechaUltimaMod: new FormControl(),
            alias: new FormControl('', Validators.maxLength(100)),
            pdfTitulo: this.pdf.crearFormulario(),
            pdfCedulaIdent: this.pdf.crearFormulario(),
            pdfVtoRuta: this.pdf.crearFormulario(),
            pdfVtoInspTecnica: this.pdf.crearFormulario(),
            pdfVtoSenasa: this.pdf.crearFormulario(),
            pdfHabBromat: this.pdf.crearFormulario()
        })
    }
}