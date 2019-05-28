import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class CostoInsumoProducto {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            nombre: new FormControl(),
            rubroProducto: new FormControl(),
            marcaProducto: new FormControl(),
            unidadMedida: new FormControl(),
            modelo: new FormControl(),
            precioUnitarioVenta: new FormControl('', Validators.required),
            precioUnitarioViaje: new FormControl(),
            coeficienteITC: new FormControl('', Validators.required),
            esAsignable: new FormControl(),
            esCritico: new FormControl(),
            esSerializable: new FormControl(),
            stockMinimo: new FormControl(),
            usuario: new FormControl(),
        })
    }
}