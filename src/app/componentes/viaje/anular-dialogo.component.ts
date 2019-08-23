import { Component, Inject } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

//Componente AnularDialogo
@Component({
    selector: 'anular-dialogo',
    templateUrl: './anular-dialogo.component.html'
})
export class AnularDialogo {
    //Define el tema
    public tema: string;
    //Define el formulario
    public formulario: FormGroup;
    //Constructor
    constructor(public dialogRef: MatDialogRef<AnularDialogo>, @Inject(MAT_DIALOG_DATA) public data) { }
    ngOnInit() {
        //Establece el tema
        this.tema = this.data.tema;
        //Establece el formulario
        this.formulario = new FormGroup({
            observaciones: new FormControl('', Validators.required)
        });
    }
    onNoClick(): void {
        this.dialogRef.close();
    }
}