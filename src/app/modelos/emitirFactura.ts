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
            item: new FormControl(),
            numeroViaje: new FormControl(),
            idTramo: new FormControl(),
            numeroRemito: new FormControl(),
            bultos: new FormControl(),
            kiloEfectivo: new FormControl(),
            kiloAforado: new FormControl(),
            m3: new FormControl(),

            tarifaOVta: new FormControl(),
            descripcionCarga: new FormControl(),
            valorDeclarado: new FormControl(),
            seguro: new FormControl(),
            flete: new FormControl(),
            descuento: new FormControl(),

            retiro: new FormControl(),
            entrega: new FormControl(),
            conceptosVarios: new FormControl(),
            importe: new FormControl(),
            subtotal: new FormControl(),
            alicuotaIva: new FormControl()
        });
    }
}