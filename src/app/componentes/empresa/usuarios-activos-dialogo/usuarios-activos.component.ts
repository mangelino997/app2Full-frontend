import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-usuarios-activos',
  templateUrl: './usuarios-activos.component.html',
  styleUrls: ['./usuarios-activos.component.css']
})
export class UsuariosActivosDialogoComponent implements OnInit {

  //Define la empresa 
  public empresa = null;
  //Define la lista de usuarios activos de la empresa
  public listaUsuarios: Array<any> = [];
  //Define la lista completa de registros
  public listaCompleta = new MatTableDataSource([]);
  //Define las columnas de la tabla
  public columnas: string[] = ['ID', 'NOMBRE', 'ROL', 'SUCURSAL', 'DOMICILIO', 'PROVINCIA'];
  //Define la matSort
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  //Define la paginacion
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  //Constructor
  constructor(public dialogRef: MatDialogRef<UsuariosActivosDialogoComponent>, @Inject(MAT_DIALOG_DATA) public data,
    private usuarioServicio: UsuarioService, private toastr: ToastrService) {
    this.dialogRef.disableClose = true;
  }
  ngOnInit() {
    this.empresa = this.data.empresa;
    //Obtiene la lista de usuarios por empresa
    this.listarPorEmpresa(this.empresa);
  }
  //Obtiene la lista de usuarios por empresa
  private listarPorEmpresa(empresa): void {
    this.usuarioServicio.listarPorEmpresa(empresa.id).subscribe(
      res => {
        this.listaCompleta = new MatTableDataSource(res.json());
        this.listaCompleta.sort = this.sort;
        this.listaCompleta.paginator = this.paginator;
      },
      err => {
        this.toastr.error(err.json().mensaje);
      }
    );
  }
  //Cierra el dialogo
  onNoClick(): void {
    this.dialogRef.close();
  }
  //Verifica si se selecciono un elemento del autocompletado
  public verificarSeleccion(valor): void {
    if (typeof valor.value != 'object') {
      valor.setValue(null);
    }
  }
}
