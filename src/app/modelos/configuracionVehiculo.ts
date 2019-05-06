import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class configuracionVehiculo {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            tipoVehiculo: new FormControl('', Validators.required),
            marcaVehiculo: new FormControl('', Validators.required),
            modelo: new FormControl('', [Validators.required, Validators.maxLength(45)]),
            descripcion: new FormControl('', Validators.maxLength(100)),
            cantidadEjes: new FormControl('', [Validators.required]),
            capacidadCarga: new FormControl('', Validators.required),
            tara: new FormControl(),
            altura: new FormControl(),
            largo: new FormControl(),
            ancho: new FormControl(),
            m3: new FormControl()
        })
    }
}