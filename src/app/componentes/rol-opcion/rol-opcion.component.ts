import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { RolOpcionService } from 'src/app/servicios/rol-opcion.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-rol-opcion',
  templateUrl: './rol-opcion.component.html',
  styleUrls: ['./rol-opcion.component.css']
})
export class RolOpcionComponent implements OnInit {
  //Constructor
  constructor(public dialog: MatDialog) { }
  //Al inicializarse el componente
  ngOnInit() {
  }
  //Abre el dialogo
  openDialog(): void {
    const dialogRef = this.dialog.open(RolOpcionDialog, {
      width: '300px'
    });
  }
}

@Component({
  selector: 'rol-opcion-dialog',
  templateUrl: 'rol-opcion-dialog.html',
})
export class RolOpcionDialog {
  //Define la barra de progreso indeterminada
  public progresoActivo:boolean = false;
  //Constructor
  constructor(public dialogRef: MatDialogRef<RolOpcionDialog>,
    private rolOpcionServicio: RolOpcionService,
    private toastr: ToastrService) {}
  //Reestablece la tabla al hacer click en aceptar
  aceptar(): void {
    this.progresoActivo = true;
    this.rolOpcionServicio.reestablecerTablaDesdeCero().subscribe(
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