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
import { ClienteService } from 'src/app/servicios/cliente.service';
import { AppService } from 'src/app/servicios/app.service';


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
  //Define el id de la Orden Venta seleccionada
  public idOrdenVta:number = null;
  //Define la pestania actual seleccionada
  public pestaniaActual:string = null;
  //Define si mostrar el autocompletado
  public mostrarAutocompletado:boolean = null;
  //Define si el campo es de solo lectura
  public soloLectura:boolean = false;
  //Define la variable como un boolean
  public porEscala:boolean = false;
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
  //Define como formControl
  public precioDesde:FormControl = new FormControl();
  //Define el porcentaje como 
  public porcentaje: any;
  //Define el campo como un formControl
  public buscarPor:FormControl = new FormControl();
  //Define el campo como un formControl
  public aumento:FormControl = new FormControl();
  //Define el campo como un formControl
  public empresa:FormControl = new FormControl();
  //Define los datos de la tabla OrdenVentaTramo/OrdenVentaEscala segun la orden venta seleccionada
  public ordenVenta:Array<any> = [];
  //Define los resultados del autocompletado
  public resultados:Array<any> = [];
  //Define los resultados de autocompletado localidad
  public resultadosLocalidades:Array<any> = [];
  //Constructor
  constructor(private servicio: OrdenVentaService, private actualizacionPrecios: ActualizacionPrecios, private clienteService: ClienteService, private appService: AppService,
    private ordenVentaTramoServicio: OrdenVentaTramoService, private ordenVentaEscalaServicio: OrdenVentaEscalaService, private empresaServicio: EmpresaService, private ordenVentaServicio: OrdenVentaService,
    private toastr: ToastrService, public dialog: MatDialog) {
    //Defiene autocompletado de Clientes
    this.autocompletado.valueChanges.subscribe(data => {
      if(typeof data == 'string') {
        this.clienteService.listarPorAlias(data).subscribe(res => {
          this.resultados = res;
        })
      }
    })
    // this.autocompletado.valueChanges.subscribe(data => {
    //   if(typeof data == 'string') {
    //     this.servicio.listarPorNombre(data).subscribe(res => {
    //       this.resultados = res;
    //     })
    //   }
    // })
  }
  //Al iniciarse el componente
  ngOnInit() {
    //Define el formulario y validaciones
    this.formulario = this.actualizacionPrecios.formulario;
    //Setea el campo a buscar por defecto
    this.buscarPor.setValue(1);
    //Obtiene la lista completa de registros
    this.listarEmpresas();
    //Setea por defecto que el combo sea un aumento de precio
    this.aumento.setValue(1);
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
      console.log(id);
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
    this.indiceSeleccionado = indice;
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
    this.porEscala=this.listaCompleta[indice].tipoTarifa.porEscala; //true o false
    this.indiceSeleccionado=indice;
    
    if(this.listaCompleta[indice].tipoTarifa.porEscala==true){
      this.ordenVentaEscalaServicio.listarPorOrdenVenta(this.listaCompleta[indice].id).subscribe(
        res=>{
          this.ordenVenta=res.json();
          this.formulario.get('fechaDesde').setValue(this.ordenVenta[this.ordenVenta.length-1].preciosDesde);
          this.filtrarSiEsPorcentaje(this.ordenVenta);
        },
        err=>{
        }
      );
    }else{
      this.ordenVentaTramoServicio.listarPorOrdenVenta(this.listaCompleta[indice].id).subscribe(
        res=>{
          this.ordenVenta=res.json();
          this.formulario.get('fechaDesde').setValue(this.ordenVenta[this.ordenVenta.length-1].preciosDesde);
          this.filtrarSiEsPorcentaje(this.ordenVenta);
        },
        err=>{
        }
      );
    }
    
  }
  //Filtra las ordenes de venta y carga en la lista los de la fecha de precioDesde
  // Antes filtrabamos por fechaDesde ---> public filtrarPorPrecioDesde(ordenesDeVenta){
  public filtrarSiEsPorcentaje(ordenesDeVenta){
    this.listaFiltrada=[];
    // let fechaFiltro= this.formulario.get('fechaDesde').value;
    for(let i=0; i< ordenesDeVenta.length;i++){
      if(ordenesDeVenta[i].porcentaje==null||ordenesDeVenta[i].porcentaje==0)
      this.listaFiltrada.push(ordenesDeVenta[i]);
    }
  }
  //Abre un Modal con la lista de precios para la fecha de precioDesde
  public listaDePrecios(){
    const dialogRef = this.dialog.open(ListaPreciosDialogo, {
      width: '1100px',
      data: {fecha: this.formulario.get('fechaDesde').value, listaFiltrada: this.listaFiltrada, porEscala: this.porEscala}, 
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  //Abre un modal con los datos actualizados antes de confirmar 
  public confirmar(){
    const dialogRef = this.dialog.open(ConfimarDialogo, {
      width: '1100px',
      data: {
        formulario: this.ordenVenta, 
        porEscala: this.porEscala,
        ordenVenta: this.listaCompleta[this.indiceSeleccionado]
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result==1){
        this.reestablecerFormulario(undefined);
      }
    });
  }
  //Reestablece el formulario
  private reestablecerFormulario(id) {
    this.listaCompleta=[];
    this.formulario.get('precioDesde').setValue(null);
    this.formulario.get('porcentaje').setValue(null);
    this.empresa.setValue(null);
    this.autocompletado.setValue(null);
    
  }
  //Realiza la actualizacion del precio de la orden seleccionada
  public aplicarActualizacion(){
    if(this.formulario.get('porcentaje').value<0){
      this.toastr.error('El porcentaje no puede ser un valor Negativo');
      this.formulario.get('porcentaje').reset();
      document.getElementById('idPorcentaje').focus();
    }else{
      switch(this.aumento.value){
        case 0:
          this.aplicarAnulacion();
          break;
        case 1:
          this.aplicarAumento();
          break;
      }
    }
  }
  //Aplica un aumento de porcentaje en los precios de la orden venta seleccionada
  public aplicarAumento(){
    this.formulario.get('porcentaje').setValue(this.returnDecimales(this.formulario.get('porcentaje').value, 2));
    let porcentaje =this.formulario.get('porcentaje').value;
    if(this.porEscala==true){
      for(let i=0; i< this.ordenVenta.length; i++){
        if(this.ordenVenta[i].importeFijo!=0&&this.ordenVenta[i].importeFijo!=null)
          this.ordenVenta[i].importeFijo=this.returnDecimales(this.ordenVenta[i].importeFijo+this.ordenVenta[i].importeFijo*(porcentaje/100),2);
        else
          this.ordenVenta[i].importeFijo=0;

        if(this.ordenVenta[i].precioUnitario!=0&&this.ordenVenta[i].precioUnitario!=null)
          this.ordenVenta[i].precioUnitario=this.returnDecimales(this.ordenVenta[i].precioUnitario+this.ordenVenta[i].precioUnitario*(porcentaje/100),2);
        else
          this.ordenVenta[i].precioUnitario=0;
      }
    }
    else{
      for(let i=0; i< this.ordenVenta.length; i++){
        if(this.ordenVenta[i].importeFijoSeco!=0&&this.ordenVenta[i].importeFijoSeco!=null)
          this.ordenVenta[i].importeFijoSeco=this.returnDecimales(this.ordenVenta[i].importeFijoSeco+this.ordenVenta[i].importeFijoSeco*(porcentaje/100),2);
        else
          this.ordenVenta[i].importeFijoSeco=0;

        if(this.ordenVenta[i].importeFijoRef!=0&&this.ordenVenta[i].importeFijoRef!=null)
          this.ordenVenta[i].importeFijoRef=this.returnDecimales(this.ordenVenta[i].importeFijoRef+this.ordenVenta[i].importeFijoRef*(porcentaje/100),2);
        else
          this.ordenVenta[i].importeFijoRef=0;

        if(this.ordenVenta[i].precioUnitarioRef!=0&&this.ordenVenta[i].precioUnitarioRef!=null)
          this.ordenVenta[i].precioUnitarioRef=this.returnDecimales(this.ordenVenta[i].precioUnitarioRef+this.ordenVenta[i].precioUnitarioRef*(porcentaje/100),2);
        else
          this.ordenVenta[i].precioUnitarioRef=0;

        if(this.ordenVenta[i].precioUnitarioSeco!=0&&this.ordenVenta[i].precioUnitarioSeco!=null)
          this.ordenVenta[i].precioUnitarioSeco=this.returnDecimales(this.ordenVenta[i].precioUnitarioSeco+this.ordenVenta[i].precioUnitarioSeco*(porcentaje/100),2);
        else
          this.ordenVenta[i].precioUnitarioSeco=0;
      }
    }
  }
  //Aplica una anulacion de porcentaje en los precios de la orden de venta seleccionada
  public aplicarAnulacion(){
    this.formulario.get('porcentaje').setValue(this.returnDecimales(this.formulario.get('porcentaje').value, 2));
    let porcentaje =this.formulario.get('porcentaje').value;
    if(this.porEscala==true){
      for(let i=0; i< this.ordenVenta.length; i++){
        if(this.ordenVenta[i].importeFijo!=0&&this.ordenVenta[i].importeFijo!=null)
          this.ordenVenta[i].importeFijo=this.returnDecimales(this.ordenVenta[i].importeFijo-this.ordenVenta[i].importeFijo*(porcentaje/100), 2);
        else
          this.ordenVenta[i].importeFijo=0;

        if(this.ordenVenta[i].precioUnitario!=0&&this.ordenVenta[i].precioUnitario!=null)
          this.ordenVenta[i].precioUnitario=this.returnDecimales(this.ordenVenta[i].precioUnitario-this.ordenVenta[i].precioUnitario*(porcentaje/100),2);
        else
          this.ordenVenta[i].precioUnitario=0;
      }
    }
    else{
      for(let i=0; i< this.ordenVenta.length; i++){
        if(this.ordenVenta[i].importeFijoSeco!=0&&this.ordenVenta[i].importeFijoSeco!=null)
          this.ordenVenta[i].importeFijoSeco=this.returnDecimales(this.ordenVenta[i].importeFijoSeco-this.ordenVenta[i].importeFijoSeco*(porcentaje/100),2);
        else
          this.ordenVenta[i].importeFijoSeco=0;

        if(this.ordenVenta[i].importeFijoRef!=0&&this.ordenVenta[i].importeFijoRef!=null)
          this.ordenVenta[i].importeFijoRef=this.returnDecimales(this.ordenVenta[i].importeFijoRef-this.ordenVenta[i].importeFijoRef*(porcentaje/100),2);
        else
            this.ordenVenta[i].importeFijoRef=0;

        if(this.ordenVenta[i].precioUnitarioRef!=0&&this.ordenVenta[i].precioUnitarioRef!=null)
          this.ordenVenta[i].precioUnitarioRef=this.returnDecimales(this.ordenVenta[i].precioUnitarioRef-this.ordenVenta[i].precioUnitarioRef*(porcentaje/100),2);
        else
          this.ordenVenta[i].precioUnitarioRef=0;

        if(this.ordenVenta[i].precioUnitarioSeco!=0&&this.ordenVenta[i].precioUnitarioSeco!=null)
          this.ordenVenta[i].precioUnitarioSeco=this.returnDecimales(this.ordenVenta[i].precioUnitarioSeco-this.ordenVenta[i].precioUnitarioSeco*(porcentaje/100),2);
        else
          this.ordenVenta[i].precioUnitarioSeco=0;
      }
    }
  }
  //Valida que la nueva fechaDesde sea mayor a la de precioDesde
  public validarNuevaFechaDesde(){
    if(this.formulario.get('precioDesde').value>this.formulario.get('fechaDesde').value){
      document.getElementById('btn-confirm').focus();
      if(this.porEscala==true){
        for(let i=0;i<this.ordenVenta.length; i++){
          this.ordenVenta[i].preciosDesde=this.formulario.get('precioDesde').value;
        }
      }
      else{
        for(let i=0;i<this.ordenVenta.length; i++){
          this.ordenVenta[i].preciosDesde=this.formulario.get('precioDesde').value;
        }
      }
    }
    else{
      this.formulario.get('precioDesde').setValue(null);
      document.getElementById('idNuevoPrecioDesde').focus();
      this.toastr.error("¡La nueva fecha debe ser mayor a la anterior!");
    }
  }
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
  //Retorna el numero a x decimales
  public returnDecimales(valor: number, cantidad: number) {
    return this.appService.setDecimales(valor, cantidad);
  }
}
@Component({
  selector: 'lista-precios-dialogo',
  templateUrl: 'lista-precios.html',
})
export class ListaPreciosDialogo{
  //Define la empresa 
  public fecha: string;
  //Define la variable como un booleano
  public porEscala: boolean;
  //Define la lista de usuarios activos de la empresa
  public listaPrecios:Array<any> = [];

  constructor(public dialogRef: MatDialogRef<ListaPreciosDialogo>, @Inject(MAT_DIALOG_DATA) public data, private toastr: ToastrService) {}
   ngOnInit() {
    this.listaPrecios=this.data.listaFiltrada;
    this.fecha=this.data.fecha;
    this.porEscala= this.data.porEscala; //controlo que tabla muestro en el modal
   }
  onNoClick(): void {
    this.dialogRef.close();
    document.getElementById('idActualizacion').focus();
  }  
}
@Component({
  selector: 'confirmar-dialogo',
  templateUrl: 'confirmar-modal.html',
})
export class ConfimarDialogo{
  //Define el formulario que envía a la base de datos
  public formulario:Array<any> = [];
  //Define la variable como un booleano
  public porEscala: boolean;
  //Define la Orden Venta seleccionada
  public ordenVenta: FormControl= new FormControl();

  constructor(public dialogRef: MatDialogRef<ConfimarDialogo>, @Inject(MAT_DIALOG_DATA) public data, private toastr: ToastrService,
  private ordenVentaTramoServicio: OrdenVentaTramoService, private ordenVentaEscalaServicio: OrdenVentaEscalaService) {}
   ngOnInit() {
    this.formulario=this.data.formulario;
    this.porEscala= this.data.porEscala; //controlo que tabla muestro en el modal
    this.ordenVenta.setValue(this.data.ordenVenta);
   }
   public actualizar(){
    for(let i=0; i<this.formulario.length; i++){ //Agrega a cada registro los datos de la orden venta seleccionada
      this.formulario[i]['ordenVenta'] = this.ordenVenta.value;
      this.formulario[i]['id'] = 0;
      this.formulario[i]['version'] = 0;

    }
    console.log(this.formulario);

    if(this.porEscala==true){
      this.ordenVentaEscalaServicio.agregarLista(this.formulario).subscribe(
        res => {
          var respuesta = res.json();
          if(respuesta.codigo == 201) {
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
    }else{
      this.ordenVentaTramoServicio.agregarLista(this.formulario).subscribe(
        res => {
          var respuesta = res.json();
          if(respuesta.codigo == 201) {
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
   }
  onNoClick(): void {
    this.dialogRef.close();
    // document.getElementById('idActualizacion').focus();
  } 
}
