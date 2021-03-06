import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class InsumoProducto {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            nombre: new FormControl(),
            rubroProducto: new FormControl('', Validators.required),
            marcaProducto: new FormControl('', Validators.required),
            unidadMedida: new FormControl('', Validators.required),
            modelo: new FormControl(),
            precioUnitarioVenta: new FormControl(),
            precioUnitarioViaje: new FormControl(),
            itcPorLitro: new FormControl(),
            itcNeto: new FormControl(),
            esAsignable: new FormControl('', Validators.required),
            esCritico: new FormControl('', Validators.required),
            esSerializable: new FormControl('', Validators.required),
            stockMinimo: new FormControl(),
            usuario: new FormControl(),
            alias: new FormControl(),
        })
    }
}