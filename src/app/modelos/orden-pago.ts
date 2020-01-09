import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class OrdenPago {
    //Define un formulario FormGroup
    public formulario: FormGroup;
    //Define formulario de Totales
    public formularioTotales: FormGroup;
    //Define formulario de Integración
    public formularioIntegrar: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            empresa: new FormControl(),
            sucursal: new FormControl(),
            tipoComprobante: new FormControl(),
            fechaEmision: new FormControl(),
            fechaRegistracion: new FormControl(),
            proveedor: new FormControl('', Validators.required),
            importe: new FormControl('', Validators.required),
            observaciones: new FormControl(),
            usuarioAlta: new FormControl(),
            usuarioBaja: new FormControl(),
            usuarioMod: new FormControl()
        });
        //Establece el formulario de Totales
        this.formularioTotales = new FormGroup({
            itemsImporte: new FormControl(),
            importe: new FormControl(),
            totalItems: new FormControl(),
            deuda: new FormControl()
        });
        //Establece el formulario integrar
        this.formularioIntegrar = new FormGroup({
            pendienteIntegrar: new FormControl(),
            retenciones: new FormControl(),
            totalIntegrado: new FormControl()
        });
    }
}