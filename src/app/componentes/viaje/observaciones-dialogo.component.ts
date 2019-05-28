import { Component, Inject } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

//Componente ObservacionesDialogo
@Component({
    selector: 'observaciones-dialogo',
    templateUrl: './observaciones-dialogo.component.html'
})
export class ObservacionesDialogo {
    //Define el tema
    public tema: string;
    //Define el formulario
    public formulario: FormGroup;
    //Define la observacion
    public observaciones: string;
    //Define si es solo lectura
    public soloLectura:boolean = true;
    //Constructor
    constructor(public dialogRef: MatDialogRef<ObservacionesDialogo>, @Inject(MAT_DIALOG_DATA) public data) { }
    ngOnInit() {
        //Establece el tema
        this.tema = this.data.tema;
        //Establece el formulario
        this.formulario = new FormGroup({
            observaciones: new FormControl()
        });
        if(this.data.elemento) {
            //Establece las observaciones
            this.formulario.get('observaciones').setValue(this.data.elemento);
        }
        //Establece solo lectura
        this.soloLectura = this.data.soloLectura;
    }
    onNoClick(): void {
        this.dialogRef.close();
    }
}