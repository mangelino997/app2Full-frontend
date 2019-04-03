import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class EmitirFactura {
    //define un formulario FormGroup
    public formulario: FormGroup;
    public formularioViaje: FormGroup;
    public formularioContraReembolso: FormGroup;


    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            empresa: new FormControl(),
            sucursal: new FormControl(),
            usuarioAlta: new FormControl(),
            fechaEmision: new FormControl(),
            fechaVtoPago: new FormControl(),
            fechaRegistracion: new FormControl(),
            afipConcepto: new FormControl(),
            moneda: new FormControl(1),
            monedaCotizacion: new FormControl(1),
            puntoVenta: new FormControl(),
            letra: new FormControl(),
            numero: new FormControl(),
            codigoAfip: new FormControl(),
            tipoComprobante: new FormControl(),
            pagoEnOrigen: new FormControl(),
            esCAEA: new FormControl(),
            afipCondicionIva: new FormControl(),
            cliente: new FormControl(),
            clienteRemitente: new FormControl(),
            rem: new FormGroup({
                domicilio: new FormControl(),
                localidad: new FormControl(),
                afipCondicionIva: new FormControl(),
                condicionVenta: new FormControl(),
                sucursal: new FormControl()
            }),
            clienteDestinatario: new FormControl(),
            des: new FormGroup({
                domicilio: new FormControl(),
                localidad: new FormControl(),
                afipCondicionIva: new FormControl(),
                condicionVenta: new FormControl(),
                sucursal: new FormControl()
            }),
            ventaComprobanteItemFAs: new FormControl(),
            ventaComprobanteItemCR: new FormControl(),
            total: new FormControl(0.00),
            importeNoGravado: new FormControl(),
            importeExento: new FormControl(),
            importeNetoGravado: new FormControl(),
            importeIva: new FormControl(0.00),
            importeTotal: new FormControl(0.00),
            importeOtrosTributos: new FormControl(),
            importeSaldo: new FormControl(),
            ordenVenta: new FormControl(),
            contrareembolso: new FormControl(),
            porcentajeCC: new FormControl(),
            comision: new FormControl(),
            alicuotaIva: new FormControl(''),
            condicionVenta: new FormControl('', Validators.required),
            tipoDocumento: new FormControl('', Validators.required),
            numeroDocumento: new FormControl('', Validators.required),           
            cobrador: new FormControl('', Validators.required)           

        });
        this.formularioViaje = new FormGroup({
            ventaTipoItem: new FormControl('', Validators.required),
            numeroViaje: new FormControl('', Validators.required),
            viajeRemito: new FormControl('', Validators.required),
            bultos: new FormControl(0.00),
            kilosEfectivo: new FormControl(0.00),
            kilosAforado: new FormControl(0.00),
            m3: new FormControl(),
            ordenVenta: new FormControl('', Validators.required),
            descripcionCarga: new FormControl(),
            valorDeclarado: new FormControl(0.00),
            importeSeguro: new FormControl(0.00),
            flete: new FormControl(0.00),
            importeFlete: new FormControl(0),
            descuento: new FormControl(0.00),
            importeRetiro: new FormControl(0.00),
            importeEntrega: new FormControl(0.00),
            conceptosVarios: new FormControl(),
            importeVentaItemConcepto: new FormControl(0.00),
            importeNetoGravado: new FormControl(0.00, Validators.required),
            importeNoGravado: new FormControl(0.00),
            importeIva: new FormControl(0, Validators.required),
            alicuotaIva: new FormControl(0.00),
            importeExento: new FormControl(0.00),
            afipAlicuotaIva: new FormControl(''),
            provincia: new FormControl(0.00),
        });
        this.formularioContraReembolso = new FormGroup({
            item: new FormControl('', Validators.required),
            porcentajeCC: new FormControl('', Validators.required),
            ordenVenta: new FormControl('', Validators.required),
            importeContraReembolso: new FormControl('', Validators.required),
            pComision: new FormControl('', Validators.required),
            alicuotaIva: new FormControl('', Validators.required),
            importeIva: new FormControl(0.00)
        });
    }
}