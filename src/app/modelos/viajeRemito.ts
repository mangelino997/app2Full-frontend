import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Injectable } from '@angular/core';
//Define la entidad de la base de datos.
@Injectable()
export class ViajeRemito {
    //Define un formulario
    public formulario:FormGroup;
    //constructor
    constructor(private fb: FormBuilder) {
        this.formulario = this.fb.group({
            tramo: new FormControl('', Validators.required),
            numeroCamion: new FormControl('', Validators.required),
            sucursalDestino: new FormControl('', Validators.required),
            remitos: this.fb.array([])
        });
    }
    //Crea el array de remitos
    public crearRemitos(elemento): FormGroup {
        return this.fb.group({
            id: elemento.id,
            version: elemento.version,
            sucursalIngreso: elemento.sucursalIngreso,
            empresa: elemento.empresa,
            fecha: elemento.fecha,
            numeroCamion: elemento.numeroCamion,
            sucursalDestino: elemento.sucursalDestino,
            tipoComprobante: elemento.tipoComprobante,
            puntoVenta: elemento.puntoVenta,
            letra: elemento.letra,
            numero: elemento.numero,
            clienteRemitente: elemento.clienteRemitente,
            clienteDestinatario: elemento.clienteDestinatario,
            sucursalClienteDest: elemento.sucursalClienteDest,
            bultos: elemento.bultos,
            kilosEfectivo: elemento.kilosEfectivo,
            kilosAforado: elemento.kilosAforado,
            m3: elemento.m3,
            valorDeclarado: elemento.valorDeclarado,
            importeRetiro: elemento.importeRetiro,
            importeEntrega: elemento.importeEntrega,
            estaPendiente: elemento.estaPendiente,
            observaciones: elemento.observacion,
            estaFacturado: elemento.estaFacturado,
            estaEnReparto: elemento.estaEnReparto,
            alias: elemento.alias,
            usuarioAlta: elemento.usuarioAlta,
            usuarioMod: elemento.usuarioMod
        })
    }
}