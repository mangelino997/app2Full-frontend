import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { RolSubopcionService } from 'src/app/servicios/rol-subopcion.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-rol-subopcion',
  templateUrl: './rol-subopcion.component.html',
  styleUrls: ['./rol-subopcion.component.css']
})
export class RolSubopcionComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(RolSubopcionDialog, {
      width: '300px'
    });
  }

}

@Component({
  selector: 'rol-subopcion-dialog',
  templateUrl: 'rol-subopcion-dialog.html',
})
export class RolSubopcionDialog {

  public progresoActivo:boolean = false;

  constructor(public dialogRef: MatDialogRef<RolSubopcionDialog>,
    private rolSubopcionServicio: RolSubopcionService,
    private toastr: ToastrService) {}

  aceptar(): void {
    this.progresoActivo = true;
    this.rolSubopcionServicio.reestablecerTablaDesdeCero().subscribe(
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

  cancelar(): void {
    this.dialogRef.close();
  }

}
