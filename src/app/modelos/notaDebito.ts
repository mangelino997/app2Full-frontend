import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class NotaDebito{
    //define un formulario FormGroup
    public formulario: FormGroup;
    //define el formulario como FormGroup
    public formularioComprobante: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            fechaEmision: new FormControl('', Validators.required),
            empresa: new FormControl(''),
            sucursal: new FormControl(''),
            usuarioAlta: new FormControl(''),
            puntoVenta: new FormControl('', Validators.required),
            letra: new FormControl(),
            numero: new FormControl(),
            codigoAfip: new FormControl('', Validators.required),
            ventaComprobante: new FormControl(),
            ventaTipoItem: new FormControl('', Validators.required),
            jurisdiccion: new FormControl('', Validators.required),
            cliente: new FormControl(),
            cli: new FormGroup({
                domicilio: new FormControl(),
                localidad: new FormControl(),
                afipCondicionIva: new FormControl(),
                condicionVenta: new FormControl(),
                numeroDocumento: new FormControl(),
                tipoDocumento: new FormControl(),
            }),
            numeroDocumento: new FormControl('', Validators.required),
            domicilio: new FormControl(),
            condicionIVA: new FormControl('', Validators.required),
            afipConcepto: new FormControl(),
            afipAlicuotaIva: new FormControl(),
            alicuotaIva: new FormControl(),
            importeIva: new FormControl(),
            importeNoGravado: new FormControl(),
            importeNetoGravado: new FormControl(),
            importeTotal: new FormControl(),
            importeExento: new FormControl(),
            provincia: new FormControl(),
            ventaComprobanteAplicado: new FormControl(),
            ventaComprobanteItem: new FormControl(),
            comprobanteAplicado: new FormControl(),
            observaciones: new FormControl(),
        });
        // crear el formulario para modificar datos
        this.formularioComprobante = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            fechaEmision: new FormControl(),
            puntoVenta: new FormControl(),
            numero: new FormControl(),
            letra: new FormControl(),
            ventaComprobante: new FormControl(),
            ventaTipoItem: new FormControl(),
            condicionIVA: new FormControl(),
            afipAlicuotaIva: new FormControl(),
            alicuotaIva: new FormControl(),
            importeIva: new FormControl(),
            tipoComprobante: new FormControl(),
            importeNoGravado: new FormControl(),
            importeNetoGravado: new FormControl(),
            importeTotal: new FormControl('', Validators.required),
            subtotalND: new FormControl(),
            checked: new FormControl(false),
            importeExento: new FormControl(),
            importeSaldo: new FormControl(),
            provincia: new FormControl(),
            ventaComprobanteAplicado: new FormControl(),
            comprobanteAplicado: new FormControl(),
            itemTipo: new FormControl('', Validators.required), //Guarda el motivo por el cual se realizo el cambio 
            concepto: new FormControl()
        });
        
    }
}