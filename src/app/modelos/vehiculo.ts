import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class Vehiculo {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            configuracionVehiculo: new FormControl('', Validators.required),
            dominio: new FormControl('', [Validators.required, Validators.maxLength(10)]),
            numeroInterno: new FormControl('', Validators.maxLength(5)),
            localidad: new FormControl('', Validators.required),
            anioFabricacion: new FormControl('', [Validators.required, Validators.min(1), Validators.maxLength(4)]),
            numeroMotor: new FormControl('', [Validators.min(5), Validators.maxLength(25)]),
            numeroChasis: new FormControl('', [Validators.min(5), Validators.maxLength(25)]),
            empresa: new FormControl('', Validators.required),
            personal: new FormControl(),
            vehiculoRemolque: new FormControl(),
            companiaSeguroPoliza: new FormControl(),
            vtoRTO: new FormControl('', Validators.required),
            numeroRuta: new FormControl('', [Validators.required, Validators.min(5), Validators.maxLength(25)]),
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
            pdfTitulo: new FormGroup({
                id: new FormControl(),
                version: new FormControl(),
                nombre: new FormControl(),
                tipo: new FormControl(),
                tamanio: new FormControl(),
                datos: new FormControl()
            }),
            pdfCedulaIdent: new FormGroup({
                id: new FormControl(),
                version: new FormControl(),
                nombre: new FormControl(),
                tipo: new FormControl(),
                tamanio: new FormControl(),
                datos: new FormControl()
            }),
            pdfVtoRuta: new FormGroup({
                id: new FormControl(),
                version: new FormControl(),
                nombre: new FormControl(),
                tipo: new FormControl(),
                tamanio: new FormControl(),
                datos: new FormControl()
            }),
            pdfVtoInspTecnica: new FormGroup({
                id: new FormControl(),
                version: new FormControl(),
                nombre: new FormControl(),
                tipo: new FormControl(),
                tamanio: new FormControl(),
                datos: new FormControl()
            }),
            pdfVtoSenasa: new FormGroup({
                id: new FormControl(),
                version: new FormControl(),
                nombre: new FormControl(),
                tipo: new FormControl(),
                tamanio: new FormControl(),
                datos: new FormControl()
            }),
            pdfHabBromat: new FormGroup({
                id: new FormControl(),
                version: new FormControl(),
                nombre: new FormControl(),
                tipo: new FormControl(),
                tamanio: new FormControl(),
                datos: new FormControl()
            })
        })
    }
}