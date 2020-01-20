import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AppService } from 'src/app/servicios/app.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FechaService } from 'src/app/servicios/fecha.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-comprobante',
  templateUrl: './comprobante.component.html',
  styleUrls: ['./comprobante.component.css']
})
export class ComprobanteComponent implements OnInit {
  //Define el formulario
  public formulario:FormGroup;
  //Define la fecha actual
  public fechaActual:any = null;
  //Define variable para mostrar o no el progress bar
  public show: boolean = false;
  //Define la lista de usuario
  public usuarios:Array<any> = [];
  //Define la razon social del proveedor
  public proveedorRazonSocial:FormControl = new FormControl();
  //Define el destino egreso
  public destinoEgreso:FormControl = new FormControl();
  //Define el constructor de la clase
  constructor(public dialogRef: MatDialogRef<ComprobanteComponent>, @Inject(MAT_DIALOG_DATA) public data,
    private appService: AppService, private fechaService: FechaService,
    private usuarioService: UsuarioService) { }
  //Al inicializarse el componente ejecuta el codigo de OnInit
  ngOnInit() {
    //Establece el formulario
    this.formulario = new FormGroup({
      empresa: new FormControl(),
      sucursal: new FormControl(),
      tipoComprobante: new FormControl(),
      fechaEmision: new FormControl('', Validators.required),
      fechaRegistracion: new FormControl(),
      proveedor: new FormControl(),
      importe: new FormControl(),
      observaciones: new FormControl(),
      usuarioAlta: new FormControl(),
      usuarioBaja: new FormControl(),
      usuarioMod: new FormControl()
    });
    //Establece el importe
    this.formulario.get('importe').setValue(this.appService.establecerDecimales(this.data.importe, 2));
    //Establece el proveedor
    this.formulario.get('proveedor').setValue(this.data.proveedor);
    //EStablece la razon social del proveedor
    this.proveedorRazonSocial.setValue(this.data.proveedor.razonSocial);
    //Obtiene la fecha actual
    this.obtenerFechaActual();
    //Obtiene la lista de usuarios
    this.listarUsuarios();
  }
  //Obtiene la fecha actual
  private obtenerFechaActual(): void {
    this.show = true;
    this.fechaService.obtenerFecha().subscribe(
      res => {
        this.fechaActual = res.json();
        this.formulario.get('fechaEmision').setValue(this.fechaActual);
        this.show = false;
      },
      err => {
        this.show = false;
      }
    );
  }
  //Obtiene la lista de usuarios
  private listarUsuarios(): void {
    this.show = true;
    this.usuarioService.listar().subscribe(
      res => {
        this.usuarios = res.json();
        this.show = false;
      },
      err => {
        this.show = false;
      }
    );
  }
  //Mascara un importe decimal
  public mascararImporte(limite, decimalLimite) {
    return this.appService.mascararImporte(limite, decimalLimite);
  }
  //Funcion para comparar y mostrar elemento de campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if (a != null && b != null) {
      return a.id === b.id;
    }
  }
  //Cierra el dialogo
  public cerrar(): void {
    this.dialogRef.close();
  }
}