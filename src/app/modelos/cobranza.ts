import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class Cobranza {
    //Define un formulario FormGroup
    public formulario: FormGroup;
    //Define formulario de Totales
    public formularioTotales: FormGroup;
    //Define formulario de Integración
    public formularioIntegrar: FormGroup;
    //Define formulario de medio de pago
    public formularioMedioPago: FormGroup;
    //Define un formulario para guardar el contenido que se establece en cada dialogo
    public formularioDialogo: FormGroup;
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
            cliente: new FormControl('', Validators.required),
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
        //Establece el formulario de medio de pago
        this.formularioMedioPago = new FormGroup({
            nombre: new FormControl(),
            importe: new FormControl()
        });
        //Establece el formulario dialogo
        this.formularioDialogo = new FormGroup({
            anticipos: new FormControl(),
            efectivo: new FormControl(),
            chequespropios: new FormControl(),
            cheques: new FormControl(),
            chequeselectronicos: new FormControl(),
            transferenciabancaria: new FormControl(),
            documentos: new FormControl(),
            otrasmonedas: new FormControl(),
            retenciones: new FormControl()
        });
    }
}