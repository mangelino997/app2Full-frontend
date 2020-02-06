import { Component, OnInit, ViewChild, Inject } from "@angular/core";
import { MatTableDataSource, MatSort, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { TipoLiquidacionSueldoService } from "src/app/servicios/tipo-liquidacion-sueldo.service";
import { ToastrService } from "ngx-toastr";
import { SelectionModel } from "@angular/cdk/collections";

@Component({
    selector: 'app-liquidaciones-asociadas',
    templateUrl: './liquidaciones-asociadas.component.html',
    styleUrls: ['./liquidaciones-asociadas.component.css']
})
export class LiquidacionesAsociadasComponent implements OnInit {
    //Declara la lista de datos
    public listaCompleta = new MatTableDataSource([]);
    //Lista que el usuario selecciono
    public listaCompletaSeleccionados = new SelectionModel<any>(true, []);
    //Declara las columnas
    public columnas: string[] = ['CHECK', 'CODIGO_AFIP', 'NOMBRE'];
    @ViewChild(MatSort, { static: false }) sort: MatSort;
    //Define el constructor de la clase
    constructor(private tipoLiquidacionSueldoService: TipoLiquidacionSueldoService, private toastr: ToastrService,
        public dialogRef: MatDialogRef<LiquidacionesAsociadasComponent>, @Inject(MAT_DIALOG_DATA) public data) {
    }
    //Al inicializarse el componente ejecuta el codigo de OnInit
    ngOnInit() {
        if(this.data.tiposLiquidacionesSueldos.listaCompletaSeleccionados.selected.length > 0) {
            this.verificarDatosExistentes();
        } else {
            //Obtiene la lista de tipos de liquidaciones asociadas
            this.listaTipoLiquidacionAsoc();
        }
    }
    //Obtiene la lista de tipos de liquidaciones asociadas
    public listaTipoLiquidacionAsoc() {
        this.tipoLiquidacionSueldoService.listar().subscribe(
            res => {
                this.listaCompleta = new MatTableDataSource(res.json());
            },
            err => {
                this.toastr.error();
            }
        )
    }
    private verificarDatosExistentes() {
        this.listaCompleta = new MatTableDataSource(this.data.tiposLiquidacionesSueldos.listaCompleta.data);
        this.data.tiposLiquidacionesSueldos.listaCompletaSeleccionados.selected.forEach((elem) => {
            this.listaCompletaSeleccionados.toggle(elem);
        });
    }
    //Acepta y Cierra el dialogo
    public confirmar() {
        let elemento = {
            listaCompleta: this.listaCompleta,
            listaCompletaSeleccionados: this.listaCompletaSeleccionados
        }
        this.dialogRef.close(elemento);
    }
    //El numero de elemento seleccionados es igual al numero total de filas (Tabla de Compras Comprobantes)
    public estanTodosSeleccionados(): boolean {
    let numSeleccionado = this.listaCompletaSeleccionados.selected.length;
    let numFilas = this.listaCompleta.data.length;
    return numSeleccionado === numFilas;
    }
     //Selecciona todos los elementos si no hay ninguno seleccionado, caso contrario, limpia todas las selecciones
    public alternarSeleccion(): void {
    this.estanTodosSeleccionados() ?
        this.listaCompletaSeleccionados.clear() :
        this.listaCompleta.data.forEach(row => this.listaCompletaSeleccionados.select(row));
    }
    //Retorna la etiqueta de seleccionada o no
    public checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.estanTodosSeleccionados() ? 'select' : 'deselect'} all`;
    }
    return `${this.listaCompletaSeleccionados.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
    }
    //Al seleccionar un checkbox
    public seleccionarCheckbox(row): void {
        this.listaCompletaSeleccionados.toggle(row);
    }
}