import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

//Componente NormalizarDialogo
@Component({
    selector: 'normalizar-dialogo',
    templateUrl: './normalizar-dialogo.component.html'
})
export class NormalizarDialogo {
    //Define el tema
    public tema: string;
    //Constructor
    constructor(public dialogRef: MatDialogRef<NormalizarDialogo>, @Inject(MAT_DIALOG_DATA) public data) { }
    ngOnInit() {
        //Establece el tema
        this.tema = this.data.tema;
    }
    onNoClick(): void {
        this.dialogRef.close();
    }
}