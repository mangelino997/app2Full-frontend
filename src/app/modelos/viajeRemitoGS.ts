import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';
@Injectable()
//Define la entidad de la base de datos.
export class ViajeRemitoGS {
    //define un formulario como un FormGroup para los datos principales 
    public formulario: FormGroup;
    //define un formulario como un FormGroup para realizar la busqueda por filtro
    public formularioFiltro: FormGroup;
    //constructor
    constructor() {
        // crear el formulario principal
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            sucursalIngreso: new FormControl(),
            empresa: new FormControl(),
            fecha: new FormControl('', Validators.required),
            numeroCamion: new FormControl('', Validators.required),
            sucursalDestino: new FormControl('', Validators.required),
            tipoComprobante: new FormControl('', Validators.required),
            puntoVenta: new FormControl('', [Validators.required, Validators.maxLength(5)]),
            letra: new FormControl('', Validators.required),
            numero: new FormControl('', [Validators.required, Validators.maxLength(8)]),
            clienteRemitente: new FormControl('', Validators.required),
            clienteDestinatario: new FormControl('', Validators.required),
            sucursalClienteDest: new FormControl(),
            bultos: new FormControl('', Validators.required),
            kilosEfectivo: new FormControl(),
            kilosAforado: new FormControl(),
            m3: new FormControl(),
            valorDeclarado: new FormControl(),
            importeRetiro: new FormControl(),
            importeEntrega: new FormControl(),
            estaPendiente: new FormControl(),
            viajePropioTramo: new FormControl(),
            viajeTerceroTramo: new FormControl(),
            observaciones: new FormControl(),
            estaFacturado: new FormControl(),
            seguimiento: new FormControl(''),
            estaEnReparto: new FormControl(),
            alias: new FormControl(),
            usuarioAlta: new FormControl(),
            usuarioMod: new FormControl()
        });
        // crear el formulario filtro
        this.formularioFiltro = new FormGroup({
            fechaDesde: new FormControl(),
            fechaHasta: new FormControl(),
            idSucursalIngreso: new FormControl(),
            idSucursalDestino: new FormControl(),
            idClienteRemitente: new FormControl(),
            idClienteDestinatario: new FormControl(),
            numeroCamion: new FormControl()
        });
    }
}