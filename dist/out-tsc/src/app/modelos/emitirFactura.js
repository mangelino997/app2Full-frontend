"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var forms_1 = require("@angular/forms");
//Define la entidad de la base de datos.
var EmitirFactura = /** @class */ (function () {
    //constructor
    function EmitirFactura() {
        // crear el formulario para la seccion de modulos
        this.formulario = new forms_1.FormGroup({
            id: new forms_1.FormControl(),
            version: new forms_1.FormControl(),
            fecha: new forms_1.FormControl(),
            puntoVenta: new forms_1.FormControl(),
            letra: new forms_1.FormControl(),
            numero: new forms_1.FormControl(),
            codigoAfip: new forms_1.FormControl(),
            tipoComprobante: new forms_1.FormControl(),
            pagoEnOrigen: new forms_1.FormControl(),
            remitente: new forms_1.FormControl(),
            rem: new forms_1.FormGroup({
                cliente: new forms_1.FormControl(),
                domicilio: new forms_1.FormControl(),
                localidad: new forms_1.FormControl(),
                afipCondicionIva: new forms_1.FormControl(),
                condicionVenta: new forms_1.FormControl(),
                sucursal: new forms_1.FormControl()
            }),
            destinatario: new forms_1.FormControl(),
            des: new forms_1.FormGroup({
                cliente: new forms_1.FormControl(),
                domicilio: new forms_1.FormControl(),
                localidad: new forms_1.FormControl(),
                afipCondicionIva: new forms_1.FormControl(),
                condicionVenta: new forms_1.FormControl(),
                sucursal: new forms_1.FormControl()
            }),
            viajes: new forms_1.FormControl(),
            total: new forms_1.FormControl(),
            importeNoGravado: new forms_1.FormControl(),
            importeGravado: new forms_1.FormControl(),
            importeIva: new forms_1.FormControl(),
            importeTotal: new forms_1.FormControl(),
            tarifaOVta: new forms_1.FormControl(),
            contrareembolso: new forms_1.FormControl(),
            porcentajeCC: new forms_1.FormControl(),
            comision: new forms_1.FormControl(),
            alicuotaIva: new forms_1.FormControl()
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
        this.formularioViaje = new forms_1.FormGroup({
            item: new forms_1.FormControl('', forms_1.Validators.required),
            numeroViaje: new forms_1.FormControl('', forms_1.Validators.required),
            idTramo: new forms_1.FormControl('', forms_1.Validators.required),
            remito: new forms_1.FormControl(),
            bultos: new forms_1.FormControl(0.00),
            kilosEfectivo: new forms_1.FormControl(0.00),
            kilosAforado: new forms_1.FormControl(0.00),
            m3: new forms_1.FormControl(),
            tarifaOVta: new forms_1.FormControl('', forms_1.Validators.required),
            descripcionCarga: new forms_1.FormControl(),
            valorDeclarado: new forms_1.FormControl(0.00),
            seguro: new forms_1.FormControl(0.00),
            flete: new forms_1.FormControl(0.00),
            descuento: new forms_1.FormControl(0.00),
            importeRetiro: new forms_1.FormControl(0.00),
            importeEntrega: new forms_1.FormControl(0.00),
            conceptosVarios: new forms_1.FormControl(),
            importeConcepto: new forms_1.FormControl(0.00),
            subtotal: new forms_1.FormControl(0.00),
            alicuotaIva: new forms_1.FormControl(0.00),
            importeIva: new forms_1.FormControl(0.00)
        });
    }
    return EmitirFactura;
}());
exports.EmitirFactura = EmitirFactura;
//# sourceMappingURL=emitirFactura.js.map