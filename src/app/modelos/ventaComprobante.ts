import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';
@Injectable()
//Define la entidad de la base de datos.
export class VentaComprobante {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            empresa: new FormControl(),
            sucursal: new FormControl(),
            puntoVenta: new FormControl('', Validators.required),
            letra: new FormControl('', Validators.required),
            numero: new FormControl('', Validators.required),
            tipoComprobante: new FormControl('', Validators.required),
            codigoAfip: new FormControl('', Validators.required),
            fechaEmision: new FormControl('', Validators.required),
            fechaVtoPago: new FormControl(),
            cliente: new FormControl('', Validators.required),
            clienteGrupo: new FormControl(),
            afipCondicionIva: new FormControl(),
            tipoDocumento: new FormControl(),
            numeroDocumento: new FormControl(),
            clienteRemitente: new FormControl(),
            clienteDestinatario: new FormControl(),
            sucursalClienteRem: new FormControl(),
            sucursalClienteDes: new FormControl(),
            condicionVenta: new FormControl(),
            importeNoGravado: new FormControl(),
            importeNetoGravado: new FormControl(),
            importeIva: new FormControl(),
            importeOtrosTributos: new FormControl(),
            importeTotal: new FormControl(),
            importeSaldo: new FormControl(),
            cobrador: new FormControl(),
            pagoEnOrigen: new FormControl(true, Validators.required), 
            usuarioAlta: new FormControl(),
            usuarioMod: new FormControl(),
            esCAEA: new FormControl(),
            CAE: new FormControl(),
            CAEVencimiento: new FormControl(),
            CAEEstado: new FormControl(),
            fechaRegistracion: new FormControl(),
            afipConceptoVenta: new FormControl(), 
            moneda: new FormControl(),
            observaciones: new FormControl(),
            monedaCotizacion: new FormControl(),
            ventaComprobanteItemCR: new FormControl([], ),
            ventaComprobanteItemND: new FormControl([], ),
            ventaComprobanteItemNC: new FormControl([], ),
            ventaComprobanteItemFAs: new FormControl([], ),

        })
    }
}