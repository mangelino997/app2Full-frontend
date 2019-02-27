import { Component, OnInit, ViewChild } from '@angular/core';
import { CompaniaSeguroPolizaService } from '../../servicios/compania-seguro-poliza.service';
import { CompaniaSeguroService } from '../../servicios/compania-seguro.service';
import { EmpresaService } from '../../servicios/empresa.service';
import { SubopcionPestaniaService } from '../../servicios/subopcion-pestania.service';
import { AppComponent } from '../../app.component';
import { FormGroup, FormControl, Validators, MaxLengthValidator } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { ClienteService } from 'src/app/servicios/cliente.service';
import { MatDialog } from '@angular/material';
import { FechaService } from 'src/app/servicios/fecha.service';
import { ClienteEventualComponent } from '../cliente-eventual/cliente-eventual.component';
import { EmitirFactura } from 'src/app/modelos/emitirFactura';
import { AppService } from 'src/app/servicios/app.service';

@Component({
  selector: 'app-emitir-factura',
  templateUrl: './emitir-factura.component.html',
  styleUrls: ['./emitir-factura.component.css']
})
export class EmitirFacturaComponent implements OnInit {
  checked = false;
  indeterminate = false;
  labelPosition = 'after';
  disabled = false;

  //Define la pestania activa
  public activeLink:any = null;
  //Define una lista
  public lista = null;
  //Define un formulario para validaciones de campos
  public formulario:FormGroup;
  public formularioRemitente:FormGroup;
  public formularioDestinatario:FormGroup;

  //Define el siguiente id
  public siguienteId:number = null;
  //Define la lista completa de registros
  public listaCompleta:any = null;
  //Define la lista de resultados de busqueda
  public resultados = [];
  //Define el form control para las busquedas cliente
  public buscarCliente:FormControl = new FormControl();
  //Define la lista de resultados de busqueda cliente
  public resultadosClientes = [];
  //Define la lista de resultados de busqueda localidad
  public resultadosLocalidades = [];
  //Define la lista de resultados de sucursales
  public resultadosSucursales = [];
  //Define el autocompletado para las busquedas
  public autocompletado:FormControl = new FormControl();
  //Define la fecha actual
  public fechaActual:string=null;
  
  //Define la lista de resultados de busqueda barrio
  public resultadosBarrios = [];
  constructor(
    private subopcionPestaniaService: SubopcionPestaniaService, private appComponent: AppComponent, public dialog: MatDialog, private fechaServicio: FechaService,
    public clienteServicio: ClienteService, private toastr: ToastrService, private factura: EmitirFactura, private appService: AppService) {}

  ngOnInit() {
    //Define el formulario de orden venta
    this.formulario = this.factura.formulario;
    this.formularioRemitente = this.factura.formularioRemitente;
    this.formularioDestinatario = this.factura.formularioDestinatario;

    this.reestablecerFormulario(undefined);
  }
  //Abre el dialogo para agregar un cliente eventual
  public agregarClienteEventual(): void {
    const dialogRef = this.dialog.open(ClienteEventualComponent, {
      width: '1200px',
      data: {
        formulario: null,
        usuario: this.appComponent.getUsuario()
      }
    });
    dialogRef.afterClosed().subscribe(resultado => {
      this.clienteServicio.obtenerPorId(resultado).subscribe(res => {
        var cliente = res.json();
        this.formulario.get('cliente').setValue(cliente);
      })
    });
  }
  //Reestablece el formulario
  public reestablecerFormulario(id){
    this.resultadosClientes=[];
    this.autocompletado.setValue(undefined);
    this.formulario.reset();
    this.fechaServicio.obtenerFecha().subscribe(res=>{
      this.formulario.get('fecha').setValue(res.json());
      this.fechaActual= res.json();
    });
    // setTimeout(function() {
    //   document.getElementById('idCliente').focus();
    // }, 20);
  }
  //Controla los checkbox
  public ordenSeleccionada(indice, $event){
    let checkboxs=document.getElementsByTagName('mat-checkbox');
    for(let i=0; i<checkboxs.length; i++){
      let id="mat-checkbox-"+(i+1);
      if(i==indice&&$event.checked==true){
        document.getElementById(id).className="checkBoxSelected";
      }
      else{
        document.getElementById(id).className="checkBoxNotSelected";
        document.getElementById(id)['checked'] = false;
      }
    }
  }
  //Formatea el numero a x decimales
  public setDecimales(valor, cantidad) {
    valor.target.value = this.appService.setDecimales(valor.target.value, cantidad);
  }
}
