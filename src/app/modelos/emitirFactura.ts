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
            remitente: new FormGroup({
                cliente: new FormControl(),
                domicilio: new FormControl(),
                localidad: new FormControl(),
                condicionIVA: new FormControl(),
                condicionVenta: new FormControl(),
                sucursal: new FormControl()
            }),
            destinatario: new FormGroup({
                cliente: new FormControl(),
                domicilio: new FormControl(),
                localidad: new FormControl(),
                condicionIVA: new FormControl(),
                condicionVenta: new FormControl(),
                sucursal: new FormControl()
            }),
            viajes: new FormControl(),

        });
        this.formularioRemitente = new FormGroup({
            cliente: new FormControl(),
            domicilio: new FormControl(),
            localidad: new FormControl(),
            condicionIVA: new FormControl(),
            condicionVenta: new FormControl(),
            sucursal: new FormControl()
        });
        this.formularioDestinatario = new FormGroup({
            cliente: new FormControl(),
            domicilio: new FormControl(),
            localidad: new FormControl(),
            condicionIVA: new FormControl(),
            condicionVenta: new FormControl(),
            sucursal: new FormControl()
        });
        this.formularioViaje = new FormGroup({
            item: new FormControl(),
            numeroViaje: new FormControl(),
            numeroRemito: new FormControl(),
            bultos: new FormControl(),
            kiloEfectivo: new FormControl(),
            kiloAforado: new FormControl(),
            m3: new FormControl(),

            tarifaVta: new FormControl(),
            descripcionCarga: new FormControl(),
            valorDeclarado: new FormControl(),
            porcentajeSeguro: new FormControl(),
            flete: new FormControl(),
            porcetajeDto: new FormControl(),

            retiro: new FormControl(),
            entrega: new FormControl(),
            conceptosVarios: new FormControl(),
            importe: new FormControl(),
            subTotal: new FormControl(),
            alicuotaIVA: new FormControl()
        });
    }
}