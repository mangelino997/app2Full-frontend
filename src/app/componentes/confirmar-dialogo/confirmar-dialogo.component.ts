import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-confirmar-dialogo',
  templateUrl: './confirmar-dialogo.component.html',
  styleUrls: ['./confirmar-dialogo.component.css']
})
export class ConfirmarDialogoComponent implements OnInit {
  //Define el mensaje
  public mensaje:string = '¿Está seguro de eliminar el registro?';
  //Constructor
  constructor(public dialog: MatDialog,
    public dialogRef: MatDialogRef<ConfirmarDialogoComponent>, @Inject(MAT_DIALOG_DATA) public data) {
    this.dialogRef.disableClose = true;
  }
  //Al inicializarse el componente
  ngOnInit() {
    //Establece el mensaje
    this.mensaje = this.data.mensaje;
  }
}