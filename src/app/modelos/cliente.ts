import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class Cliente {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            razonSocial: new FormControl('', [Validators.required, Validators.maxLength(45)]),
            nombreFantasia: new FormControl('', Validators.maxLength(45)),
            cuentaGrupo: new FormControl(),
            domicilio: new FormControl('', [Validators.required, Validators.maxLength(60)]),
            localidad: new FormControl('', [Validators.required]),
            barrio: new FormControl(),
            telefono: new FormControl('', [Validators.maxLength(45)]),
            sitioWeb: new FormControl('', [Validators.maxLength(60)]),
            zona: new FormControl('', [Validators.required]),
            rubro: new FormControl('', [Validators.required]),
            cobrador: new FormControl('', [Validators.required]),
            vendedor: new FormControl(),
            afipCondicionIva: new FormControl('', [Validators.required]),
            tipoDocumento: new FormControl('', [Validators.required]),
            numeroDocumento: new FormControl('', [Validators.required, Validators.maxLength(15)]),
            numeroIIBB: new FormControl('', Validators.maxLength(15)),
            esCuentaCorriente: new FormControl(),
            condicionVenta: new FormControl('', Validators.required),
            resumenCliente: new FormControl(),
            situacionCliente: new FormControl(),
            ordenVenta: new FormControl(),
            sucursalLugarPago: new FormControl(),
            creditoLimite: new FormControl('', [Validators.min(0), Validators.maxLength(12)]),
            descuentoFlete: new FormControl('', [Validators.min(0), Validators.maxLength(4)]),
            descuentoSubtotal: new FormControl('', [Validators.min(0), Validators.maxLength(4)]),
            esSeguroPropio: new FormControl(),
            companiaSeguro: new FormControl(),
            numeroPolizaSeguro: new FormControl('', Validators.maxLength(20)),
            vencimientoPolizaSeguro: new FormControl(),
            observaciones: new FormControl('', Validators.maxLength(400)),
            notaEmisionComprobante: new FormControl('', Validators.maxLength(200)),
            notaImpresionComprobante: new FormControl('', Validators.maxLength(200)),
            notaImpresionRemito: new FormControl('', Validators.maxLength(200)),
            imprimirControlDeuda: new FormControl('', Validators.required),
            usuarioAlta: new FormControl(),
            usuarioBaja: new FormControl(),
            fechaBaja: new FormControl(),
            usuarioMod: new FormControl(),
            fechaUltimaMod: new FormControl(),
            alias: new FormControl()
        })
    }
}