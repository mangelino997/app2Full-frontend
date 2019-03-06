import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class EmitirFactura {
    //define un formulario FormGroup
    public formulario: FormGroup;
    public formularioRemitente: FormGroup;
    public formularioDestinatario: FormGroup;
    public formularioViaje: FormGroup;

    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            fecha: new FormControl(),
            puntoVenta: new FormControl(),
            letra: new FormControl(),
            numero: new FormControl(),
            codigoAfip: new FormControl(),
            tipoComprobante: new FormControl(),
            pagoEnOrigen: new FormControl(),
            remitente: new FormControl(),
            rem: new FormGroup({
                cliente: new FormControl(),
                domicilio: new FormControl(),
                localidad: new FormControl(),
                afipCondicionIva: new FormControl(),
                condicionVenta: new FormControl(),
                sucursal: new FormControl()
            }),
            destinatario: new FormControl(),
            des: new FormGroup({
                cliente: new FormControl(),
                domicilio: new FormControl(),
                localidad: new FormControl(),
                afipCondicionIva: new FormControl(),
                condicionVenta: new FormControl(),
                sucursal: new FormControl()
            }),
            viajes: new FormControl(),
            total: new FormControl(),
            importeNoGravado: new FormControl(),
            importeGravado: new FormControl(),
            importeIva: new FormControl(),
            importeTotal: new FormControl(),
            tarifaOVta: new FormControl(),
            contrareembolso: new FormControl(),
            porcentajeCC: new FormControl(),
            comision: new FormControl(),
            alicuotaIva: new FormControl()
        });
        // this.formularioRemitente = new FormGroup({
        //     cliente: new FormControl(),
        //     domicilio: new FormControl(),
        //     localidad: new FormControl(),
        //     condicionIVA: new FormControl(),
        //     condicionVenta: new FormControl(),
        //     sucursal: new FormControl()
        // });
        // this.formularioDestinatario = new FormGroup({
        //     cliente: new FormControl(),
        //     domicilio: new FormControl(),
        //     localidad: new FormControl(),
        //     condicionIVA: new FormControl(),
        //     condicionVenta: new FormControl(),
        //     sucursal: new FormControl()
        // });
        this.formularioViaje = new FormGroup({
            item: new FormControl('', Validators.required),
            numeroViaje: new FormControl('', Validators.required),
            idTramo: new FormControl('', Validators.required),
            remito: new FormControl(),
            bultos: new FormControl(0.00),
            kilosEfectivo: new FormControl(0.00),
            kilosAforado: new FormControl(0.00),
            m3: new FormControl(),

            tarifaOVta: new FormControl('', Validators.required),
            descripcionCarga: new FormControl(),
            valorDeclarado: new FormControl(0.00),
            seguro: new FormControl(0.00),
            flete: new FormControl(0.00),
            descuento: new FormControl(0.00),

            importeRetiro: new FormControl(0.00),
            importeEntrega: new FormControl(0.00),
            conceptosVarios: new FormControl(),
            importeConcepto: new FormControl(0.00),
            subtotal: new FormControl(0.00),
            alicuotaIva: new FormControl(0.00),
            subtotalNeto: new FormControl(0.00)

        });
    }
}