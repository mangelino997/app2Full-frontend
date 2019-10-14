import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-rol-subopcion',
  templateUrl: './subopcion-pestania.component.html',
  styleUrls: ['./subopcion-pestania.component.css']
})
export class SubopcionPestaniaComponent implements OnInit {
  //Constructor
  constructor(public dialog: MatDialog) {}
  //Al inicializarse el componente
  ngOnInit() {}
  //Abre el dialogo
  openDialog(): void {
    const dialogRef = this.dialog.open(SubopcionPestaniaDialog, {
      width: '300px'
    });
  }
}
//Componente SubopcionPestaniaDialogo
@Component({
  selector: 'subopcion-pestania-dialog',
  templateUrl: 'subopcion-pestania-dialog.html',
})
export class SubopcionPestaniaDialog {
  //Define la barra de progreso indeterminada
  public progresoActivo:boolean = false;
  //Constructor
  constructor(public dialogRef: MatDialogRef<SubopcionPestaniaDialog>,
    private subopcionPestaniaServicio: SubopcionPestaniaService,
    private toastr: ToastrService) {}
  //Reestablece la tabla al hacer click en aceptar
  aceptar(): void {
    this.progresoActivo = true;
    this.subopcionPestaniaServicio.reestablecerTablaDesdeCero().subscribe(
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