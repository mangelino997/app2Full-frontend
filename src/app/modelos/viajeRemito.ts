import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class ViajeRemito {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            sucursalEmision: new FormControl(),
            empresaEmision: new FormControl(),
            usuario: new FormControl(),
            fecha: new FormControl('', Validators.required),
            numeroCamion: new FormControl('', Validators.required),
            sucursalDestino: new FormControl('', Validators.required),
            tipoComprobante: new FormControl('', Validators.required),
            puntoVenta: new FormControl('', [Validators.required, Validators.maxLength(5)]),
            letra: new FormControl('', Validators.required),
            numero: new FormControl('', [Validators.required, Validators.maxLength(8)]),
            clienteRemitente: new FormControl('', Validators.required),
            clienteDestinatario: new FormControl('', Validators.required),
            clienteDestinatarioSuc: new FormControl(),
            bultos: new FormControl('', Validators.required),
            kilosEfectivo: new FormControl(),
            kilosAforado: new FormControl(),
            m3: new FormControl(),
            valorDeclarado: new FormControl(),
            importeRetiro: new FormControl(),
            importeEntrega: new FormControl(),
            estaPendiente: new FormControl(),
            viajePropioTramo: new FormControl(),
            viajeTerceroTramo: new FormControl(),
            observaciones: new FormControl(),
            estaFacturado: new FormControl(),
            seguimiento: new FormControl(''),
            estaEnReparto: new FormControl(),
            alias: new FormControl(),
            tipoRemito: new FormControl(),
            tramo: new FormControl()
        })
    }
}