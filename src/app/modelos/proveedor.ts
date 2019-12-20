import { FormGroup, FormControl, Validators } from '@angular/forms';
//Define la entidad de la base de datos.
export class Proveedor {
    //define el formulario general como un FormGroup
    public formulario: FormGroup;
    //define el formulario proveedor-cuentaBancaria como un FormGroup
    public formularioCuentaBancaria: FormGroup;
    //constructor
    constructor() {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            razonSocial: new FormControl('', [Validators.required, Validators.maxLength(45)]),
            nombreFantasia: new FormControl('', [Validators.maxLength(45)]),
            domicilio: new FormControl('', [Validators.required, Validators.maxLength(45)]),
            barrio: new FormControl(),
            localidad: new FormControl('', Validators.required),
            tipoDocumento: new FormControl('', Validators.required),
            numeroDocumento: new FormControl('', [Validators.required, Validators.min(1), Validators.maxLength(15)]),
            numeroIIBB: new FormControl('', [Validators.min(1), Validators.maxLength(15)]),
            sitioWeb: new FormControl('', Validators.maxLength(60)),
            telefono: new FormControl('', Validators.maxLength(45)),
            afipCondicionIva: new FormControl('', Validators.required),
            condicionCompra: new FormControl('', Validators.required),
            usuarioAlta: new FormControl(),
            usuarioBaja: new FormControl(),
            usuarioMod: new FormControl(),
            fechaUltimaMod: new FormControl(),
            observaciones: new FormControl('', Validators.maxLength(400)),
            notaIngresarComprobante: new FormControl('', Validators.maxLength(200)),
            notaImpresionOrdenPago: new FormControl('', Validators.maxLength(200)),

            banco: new FormControl(),
            tipoCuentaBancaria: new FormControl(),
            numeroCuenta: new FormControl('', [Validators.min(1), Validators.maxLength(20)]),
            titular: new FormControl('', Validators.maxLength(45)),
            numeroCBU: new FormControl('', [Validators.min(1), Validators.minLength(22), Validators.maxLength(22)]),
            aliasCBU: new FormControl('', Validators.maxLength(45)),

            tipoProveedor: new FormControl('', Validators.required),
            estaActiva: new FormControl('', Validators.required),
            alias: new FormControl('', Validators.maxLength(100)),
            fechaAlta: new FormControl(),
            fechaBaja: new FormControl(),
            proveedorCuentasContables: new FormControl()
        });
        // crear el formulario para proveedor-cuentaBancaria
        this.formularioCuentaBancaria = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            banco: new FormControl('', Validators.required),
            sucursalBanco: new FormControl(),
            tipoCuentaBancaria: new FormControl('', Validators.required),
            numeroCuenta: new FormControl('', Validators.required),
            moneda: new FormControl('', Validators.required),
            titular: new FormControl('', Validators.required),
            numeroCBU: new FormControl('', Validators.required),
            aliasCBU: new FormControl(),
            estaActiva: new FormControl(),
        });
    }
}