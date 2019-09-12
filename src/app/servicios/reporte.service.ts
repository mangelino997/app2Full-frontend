import { Injectable } from "@angular/core";
import { Subject, Observable } from "rxjs";
import { ReporteDialogoComponent } from "../componentes/reporte-dialogo/reporte-dialogo.component";
import { MatDialog } from "@angular/material";

@Injectable()
export class ReporteService {
    //Define subject para botones de reportes
    public datosDialogos = new Subject();
    //Constructor
    constructor(private dialog: MatDialog) { }
    //Establece los datos del dialogo
    public establecerDatosDialogo(datos) {
        this.datosDialogos.next(datos);
    }
    public obtenerDatosDialogo(): Observable<any> {
        return this.datosDialogos.asObservable();
    }
    //Borra las columnas ver y editar para reporte
    private quitarColumnasReporte(columnas): Array<any> {
        let lista = Object.assign([], columnas);
        let indice = lista.indexOf('VER');
        if(indice != -1) {
            lista.splice(indice, 1);
        }
        indice = lista.indexOf('EDITAR');
        if(indice != -1) {
            lista.splice(indice, 1);
        }
        /*indice = lista.indexOf('PDF');
        if(indice != -1) {
            lista.splice(indice, 1);
        }*/
        indice = lista.indexOf('ELIMINAR');
        if(indice != -1) {
            lista.splice(indice, 1);
        }
        return lista;
    }
    public abrirDialogo(datos) {
        datos.columnas = this.quitarColumnasReporte(datos.columnas);
        const dialogRef = this.dialog.open(ReporteDialogoComponent, {
            width: '95%',
            height: '95%',
            maxWidth: '95%',
            maxHeight: '95%',
            data: datos
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.establecerDatosDialogo(datos);
            }
        });
    }
}