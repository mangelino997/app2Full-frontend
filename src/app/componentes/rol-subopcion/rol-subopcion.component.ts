import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { RolSubopcionService } from 'src/app/servicios/rol-subopcion.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-rol-subopcion',
  templateUrl: './rol-subopcion.component.html',
  styleUrls: ['./rol-subopcion.component.css']
})
export class RolSubopcionComponent implements OnInit {
  //Constructor
  constructor(public dialog: MatDialog) { }
  ngOnInit() {
  }
  //Abre el dialogo
  openDialog(): void {
    const dialogRef = this.dialog.open(RolSubopcionDialog, {
      width: '300px'
    });
  }
}
//Dialogo RolSubopcioin
@Component({
  selector: 'rol-subopcion-dialog',
  templateUrl: 'rol-subopcion-dialog.html',
})
export class RolSubopcionDialog {
  //Define la barra de progreso indeterminada
  public progresoActivo: boolean = false;
  //Constructor
  constructor(public dialogRef: MatDialogRef<RolSubopcionDialog>,
    private rolSubopcionServicio: RolSubopcionService,
    private toastr: ToastrService) { }
  //Reestablece la tabla al hacer click en aceptar
  aceptar(): void {
    this.progresoActivo = true;
    this.rolSubopcionServicio.reestablecerTablaDesdeCero().subscribe(
      res => {
        let respuesta = res.json();
        if (respuesta.codigo == 200) {
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