import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class Producto {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            nombre: new FormControl('', [Validators.required, Validators.maxLength(45)]),
            marcaProducto: new FormControl('', Validators.required),
            unidadMedida: new FormControl('', Validators.required),
            modelo: new FormControl('', Validators.required),
            rubroProducto: new FormControl('', Validators.required),
            esAsignable: new FormControl('', Validators.required),
            esSerializable: new FormControl('', Validators.required),
            esCritico: new FormControl('', Validators.required),
            stockMinimo: new FormControl('', Validators.required),
            precioUnitarioVenta: new FormControl('', Validators.required),
            coeficienteITC: new FormControl('', Validators.required),
            usuario: new FormControl()

        })
    }
}