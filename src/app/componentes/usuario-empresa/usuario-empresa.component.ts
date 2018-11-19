import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UsuarioEmpresaService } from 'src/app/servicios/usuario-empresa.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-usuario-empresa',
  templateUrl: './usuario-empresa.component.html',
  styleUrls: ['./usuario-empresa.component.css']
})
export class UsuarioEmpresaComponent implements OnInit {
  //Constructor
  constructor(public dialog: MatDialog) { }
  ngOnInit() {
  }
  //Abre el dialogo
  openDialog(): void {
    const dialogRef = this.dialog.open(UsuarioEmpresaDialog, {
      width: '300px'
    });
  }
}

@Component({
  selector: 'usuario-empresa-dialog',
  templateUrl: 'usuario-empresa-dialog.html',
})
export class UsuarioEmpresaDialog {
  //Define la barra de progreso indeterminada
  public progresoActivo:boolean = false;
  //Constructor
  constructor(public dialogRef: MatDialogRef<UsuarioEmpresaDialog>,
    private usuarioEmpresaServicio: UsuarioEmpresaService,
    private toastr: ToastrService) {}
  //Reestablece la tabla al hacer click en aceptar
  aceptar(): void {
    this.progresoActivo = true;
    this.usuarioEmpresaServicio.reestablecerTablaDesdeCero().subscribe(
      res => {
        let respuesta = res.json();
        if(respuesta.codigo == 200) {
          this.progresoActivo = false;
          this.dialogRef.close();
          this.toastr.success(respuesta.mensaje);
        }
      },
      err => {
        var respuesta = err.json();
        this.toastr.error(respuesta.mensaje);
      }
    )
  }
  //Cierra el dialogo
  cancelar(): void {
    this.dialogRef.close();
  }
}