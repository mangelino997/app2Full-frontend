import { FormGroup, FormControl, Validators } from '@angular/forms';
import { OrdenVentaEmpresa } from './ordenVentaEmpresa';
import { OrdenVentaCliente } from './ordenVentaCliente';
import { Injectable } from '@angular/core';
@Injectable()

//Define la entidad de la base de datos.
export class OrdenVenta {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor(private ordenVentaEmpresaModelo: OrdenVentaEmpresa, private ordenVentaClienteModelo: OrdenVentaCliente) {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            nombre: new FormControl('', Validators.required),
            // cliente: new FormControl(),
            // empresa: new FormControl(),
            cliente: this.ordenVentaClienteModelo.formulario,
            empresa: this.ordenVentaEmpresaModelo.formulario,
            vendedor: new FormControl('', Validators.required),
            seguro: new FormControl('', Validators.required),
            comisionCR: new FormControl(),
            observaciones: new FormControl(),
            esContado: new FormControl(),
            estaActiva: new FormControl('', Validators.required),
            tipoOrdenVenta: new FormControl(),
            fechaAlta: new FormControl(),
            activaDesde: new FormControl(),

        })
    }
}