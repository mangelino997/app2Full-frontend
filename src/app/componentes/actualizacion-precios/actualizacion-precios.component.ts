import { Component, OnInit, Inject } from '@angular/core';
import { AgendaTelefonicaService } from '../../servicios/agenda-telefonica.service';
import { SubopcionPestaniaService } from '../../servicios/subopcion-pestania.service';
import { LocalidadService } from '../../servicios/localidad.service';
import { AppComponent } from '../../app.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EmpresaService } from 'src/app/servicios/empresa.service';
import { ActualizacionPrecios } from 'src/app/modelos/actualizacionPrecios';
import { OrdenVentaService } from 'src/app/servicios/orden-venta.service';
import { OrdenVentaTramoService } from 'src/app/servicios/orden-venta-tramo.service';
import { OrdenVentaEscalaService } from 'src/app/servicios/orden-venta-escala.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';


@Component({
  selector: 'app-actualizacion-precios',
  templateUrl: './actualizacion-precios.component.html',
  styleUrls: ['./actualizacion-precios.component.css']
})
export class ActualizacionPreciosComponent implements OnInit {
  //Define la pestania activa
  public activeLink:any = null;
  //Define el indice seleccionado de pestania
  public indiceSeleccionado:number = null;
  //Define la pestania actual seleccionada
  public pestaniaActual:string = null;
  //Define si mostrar el autocompletado
  public mostrarAutocompletado:boolean = null;
  //Define si el campo es de solo lectura
  public soloLectura:boolean = false;
  //Define si mostrar el boton
  public mostrarBoton:boolean = null;
  //Define que campo muestra
  public buscarPorCliente:boolean = null;
  //Define la lista de pestanias
  public pestanias:Array<any> = [];
  //Define un formulario para validaciones de campos
  public formulario:FormGroup;
  //Define la lista completa de registros
  public listaCompleta:Array<any> = [];
  //Define la lista completa de registros (ordenes de venta) filtrados por la fecha de precio desde
  public listaFiltrada:Array<any> = [];
  //Define la lista completa de registros
  public empresas:Array<any> = [];
  //Define el autocompletado
  public autocompletado:FormControl = new FormControl();
  //Define el campo como un formControl
  public buscarPor:FormControl = new FormControl();
  //Define el campo como un formControl
  public empresa:FormControl = new FormControl();
  //Define los datos de la tabla OrdenVentaTramo/OrdenVentaEscala segun la orden venta seleccionada
  public ordenVenta:Array<any> = [];
  //Define los resultados del autocompletado
  public resultados:Array<any> = [];
  //Define los resultados de autocompletado localidad
  public resultadosLocalidades:Array<any> = [];
  //Constructor
  constructor(private servicio: AgendaTelefonicaService, private subopcionPestaniaService: SubopcionPestaniaService, private actualizacionPrecios: ActualizacionPrecios,
    private ordenVentaTramoServicio: OrdenVentaTramoService, private ordenVentaEscalaServicio: OrdenVentaEscalaService, private empresaServicio: EmpresaService, private ordenVentaServicio: OrdenVentaService,
    private toastr: ToastrService, public dialog: MatDialog) {
    
    //Defiene autocompletado de Clientes
    this.autocompletado.valueChanges.subscribe(data => {
      if(typeof data == 'string') {
        this.servicio.listarPorNombre(data).subscribe(res => {
          this.resultados = res;
        })
      }
    })
  }
  //Al iniciarse el componente
  ngOnInit() {
    //Define el formulario y validaciones
    this.formulario = this.actualizacionPrecios.formulario;
    //Setea el campo a buscar por defecto
    this.buscarPor.setValue(1);
    //Obtiene la lista completa de registros
    this.listarEmpresas();
  }
  //Vacia la lista de autocompletados
  public vaciarListas() {
    this.resultados = [];
    this.resultadosLocalidades = [];
  }
  //Obtiene el listado de registros
  private listarEmpresas() {
    this.empresaServicio.listar().subscribe(
      res => {
        console.log(res.json());
        this.empresas = res.json();
      },
      err => {
        console.log(err);
      }
    );
  }
  //Actualiza un registro
  public actualizar() {
  this.servicio.actualizar(this.formulario.value).subscribe(
    res => {
      var respuesta = res.json();
      if(respuesta.codigo == 200) {
        this.reestablecerFormulario(undefined);
        setTimeout(function() {
          document.getElementById('idAutocompletado').focus();
        }, 20);
        this.toastr.success(respuesta.mensaje);
      }
    },
    err => {
      var respuesta = err.json();
      if(respuesta.codigo == 11002) {
        document.getElementById("labelNombre").classList.add('label-error');
        document.getElementById("idNombre").classList.add('is-invalid');
        document.getElementById("idNombre").focus();
        this.toastr.error(respuesta.mensaje);
      }
    }
  );
  }
  //Realiza el cambio de campo a buscar
  public cambioDeCampo(){
    if(this.buscarPor.value==0){
      this.buscarPorCliente=true;
    }else{
      this.buscarPorCliente=false;
    }
  }
  //Carga la Tabla 
  public cargarTabla(opcion, id){
    this.listaCompleta=[];
    if(opcion==0){
      this.ordenVentaServicio.listarPorCliente(id).subscribe(
        res=>{
          this.listaCompleta= res.json();
        },
        err=>{
        }
      );
    }else{
      this.ordenVentaServicio.listarPorEmpresa(this.empresa.value.id).subscribe(
        res=>{
          this.listaCompleta= res.json();
        },
        err=>{
        }
      );
    }
  }
  //Controla los checkbox
  public ordenSeleccionada(indice, $event){
    let checkboxs=document.getElementsByTagName('mat-checkbox');
    for(let i=0; i<checkboxs.length; i++){
      let id="mat-checkbox-"+(i+1);
      if(i==indice&&$event.checked==true){
        document.getElementById(id).className="checkBoxSelected";
        this.buscarPorOrdenPrecios(i);
      }
      else{
        document.getElementById(id).className="checkBoxNotSelected";
        document.getElementById(id)['checked'] = false;
      }
    }
  }
  //Busca los datos segun la Orden seleccionada
  public buscarPorOrdenPrecios(indice){
    this.ordenVenta=[];
    if(this.listaCompleta[indice].tipoTarifa.porEscala==true){
      this.ordenVentaEscalaServicio.listarPorOrdenVenta(this.listaCompleta[indice].id).subscribe(
        res=>{
          console.log(res.json());
          this.ordenVenta=res.json();
          this.formulario.get('precioDesde').setValue(this.ordenVenta[this.ordenVenta.length-1].preciosDesde);
          this.filtrarPorPrecioDesde(this.ordenVenta);
        },
        err=>{
        }
      );
    }else{
      this.ordenVentaTramoServicio.listarPorOrdenVenta(this.listaCompleta[indice].id).subscribe(
        res=>{
          console.log(res.json());
          this.ordenVenta=res.json();
          this.formulario.get('precioDesde').setValue(this.ordenVenta[this.ordenVenta.length-1].preciosDesde);
          this.filtrarPorPrecioDesde(this.ordenVenta);
        },
        err=>{
        }
      );
    }
  }
  //Filtra las ordenes de venta y carga en la lista los de la fecha de precioDesde
  public filtrarPorPrecioDesde(ordenesDeVenta){
    this.listaFiltrada=[];
    let fechaFiltro= this.formulario.get('precioDesde').value;
    for(let i=0; i< ordenesDeVenta.length;i++){
      if(ordenesDeVenta[i].preciosDesde==fechaFiltro)
      this.listaFiltrada.push(ordenesDeVenta[i]);
    }
  }
  //Abre un Modal con la lista de precios para la fecha de precioDesde
  public listaDePrecios(){
    const dialogRef = this.dialog.open(ListaPreciosDialogo, {
      width: '1000px',
      data: {fecha: this.formulario.get('precioDesde').value, listaFiltrada: this.listaFiltrada},
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  //Reestablece el formulario
  private reestablecerFormulario(id) {
    this.formulario.reset();
    this.formulario.get('id').setValue(id);
    this.autocompletado.setValue(undefined);
    this.vaciarListas();
  }
  //Manejo de colores de campos y labels
  // public cambioCampo(id, label) {
  //   document.getElementById(id).classList.remove('is-invalid');
  //   document.getElementById(label).classList.remove('label-error');
  // };
  //Manejo de colores de campos y labels con patron erroneo
  public validarPatron(patron, campo) {
    let valor = this.formulario.get(campo).value;
    if(valor != undefined && valor != null && valor != '') {
      var patronVerificador = new RegExp(patron);
      if (!patronVerificador.test(valor)) {
        if(campo == 'telefonoFijo') {
          document.getElementById("labelTelefonoFijo").classList.add('label-error');
          document.getElementById("idTelefonoFijo").classList.add('is-invalid');
          this.toastr.error('Telefono Fijo Incorrecto');
        } else if(campo == 'telefonoMovil') {
          document.getElementById("labelTelefonoMovil").classList.add('label-error');
          document.getElementById("idTelefonoMovil").classList.add('is-invalid');
          this.toastr.error('Telefono Movil Incorrecto');
        } else if(campo == 'correoelectronico') {
          document.getElementById("labelCorreoelectronico").classList.add('label-error');
          document.getElementById("idCorreoelectronico").classList.add('is-invalid');
          this.toastr.error('Correo Electronico Incorrecto');
        }
      }
    }
  }
  //Muestra en la pestania buscar el elemento seleccionado de listar
  // public activarConsultar(elemento) {
  //   this.seleccionarPestania(2, this.pestanias[1].nombre, 1);
  //   this.autocompletado.setValue(elemento);
  //   this.formulario.patchValue(elemento);
  // }
  // //Muestra en la pestania actualizar el elemento seleccionado de listar
  // public activarActualizar(elemento) {
  //   this.seleccionarPestania(3, this.pestanias[2].nombre, 1);
  //   this.autocompletado.setValue(elemento);
  //   this.formulario.patchValue(elemento);
  // }
  //Define como se muestra los datos en el autcompletado
  public displayFn(elemento) {
    if(elemento != undefined) {
      return elemento.nombre ? elemento.nombre : elemento;
    } else {
      return elemento;
    }
  }
  //Formatea el valor del autocompletado a
  public displayFa(elemento) {
    if(elemento != undefined) {
      return elemento.alias ? elemento.alias : elemento;
    } else {
      return elemento;
    }
  }
  //Funcion para comparar y mostrar elemento de campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if(a != null && b != null) {
      return a.id === b.id;
    }
  }
}
@Component({
  selector: 'lista-precios-dialogo',
  templateUrl: 'lista-precios.html',
})
export class ListaPreciosDialogo{
  //Define la empresa 
  public fecha: string;
  //Define la lista de usuarios activos de la empresa
  public listaPrecios:Array<any> = [];

  constructor(public dialogRef: MatDialogRef<ListaPreciosDialogo>, @Inject(MAT_DIALOG_DATA) public data, private toastr: ToastrService) {}
   ngOnInit() {
    this.listaPrecios=this.data.listaFiltrada;
    this.fecha=this.data.fecha;
   }
  onNoClick(): void {
    this.dialogRef.close();
  }
  
}
