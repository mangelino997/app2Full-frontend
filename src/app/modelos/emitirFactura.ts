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
            afipConceptoVenta: new FormControl(),
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
            total: new FormControl(),
            importeNoGravado: new FormControl(),
            importeExento: new FormControl(),
            importeNetoGravado: new FormControl(),
            importeIva: new FormControl(),
            importeTotal: new FormControl(),
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
            ventaTipoItem: new FormControl(),
            numeroViaje: new FormControl('', Validators.required),
            viajeRemito: new FormControl('', Validators.required),
            bultos: new FormControl(),
            kilosEfectivo: new FormControl(),
            kilosAforado: new FormControl(),
            m3: new FormControl(),
            ordenVenta: new FormControl('', Validators.required),
            descripcionCarga: new FormControl(),
            valorDeclarado: new FormControl(),
            importeSeguro: new FormControl(),
            flete: new FormControl(),
            importeFlete: new FormControl(0),
            descuento: new FormControl(),
            importeRetiro: new FormControl(),
            importeEntrega: new FormControl(),
            conceptosVarios: new FormControl(),
            importeTipoConceptoVenta: new FormControl(),
            importeNetoGravado: new FormControl(),
            importeNoGravado: new FormControl(),
            importeIva: new FormControl(0),
            alicuotaIva: new FormControl(),
            importeExento: new FormControl(),
            afipAlicuotaIva: new FormControl(''),
            provincia: new FormControl(),
        });
        this.formularioContraReembolso = new FormGroup({
            item: new FormControl('', Validators.required),
            porcentajeCC: new FormControl('', Validators.required),
            ordenVenta: new FormControl('', Validators.required),
            importeContraReembolso: new FormControl('', Validators.required),
            pComision: new FormControl('', Validators.required),
            alicuotaIva: new FormControl(),
            importeIva: new FormControl()
        });
    }
}