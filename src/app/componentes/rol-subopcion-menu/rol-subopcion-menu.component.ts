import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { RolSubopcionService } from 'src/app/servicios/rol-subopcion.service';
import { RolService } from 'src/app/servicios/rol.service';
import { ModuloService } from 'src/app/servicios/modulo.service';
import { SubmoduloService } from 'src/app/servicios/submodulo.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-rol-subopcion-menu',
  templateUrl: './rol-subopcion-menu.component.html',
  styleUrls: ['./rol-subopcion-menu.component.css']
})
export class RolSubopcionMenuComponent implements OnInit {
  //Define el formulario
  public formulario:FormGroup;
  //Define la lista de roles
  public roles:Array<any> = [];
  //Define la lista de modulos
  public modulos:Array<any> = [];
  //Define la lista de submodulos
  public submodulos:Array<any> = [];
  //Define una lista de subopciones
  public subopciones:FormArray;
  //Define estado de la sidenav, modulo o submodulo
  public estadoSidenav:number;
  //Define el nombre del titulo
  public nombreTitulo:string;
  //Define el submodulo activo
  public botonOpcionActivo:number;
  //Estado de botones modulos
  public botonActivo:boolean;
  //Define el estado del boton actualizar
  public btnActualizarActivo:boolean;
  //Constructor
  constructor(private servicio: RolSubopcionService, private fb: FormBuilder,
    private rolServicio: RolService, private moduloServicio: ModuloService,
    private submoduloServicio: SubmoduloService, private toastr: ToastrService) { }
  ngOnInit() {
    //Establece el formulario
    this.formulario = this.fb.group({
      rol: new FormControl(),
      submodulo: new FormControl(),
      subopciones: this.fb.array([])
    })
    //Establece por defecto la muestra de la lista de modulo
    this.estadoSidenav = 1;
    //Establece el nombre del titulo
    this.nombreTitulo = 'MODULOS';
    //Establece como deshabilitado los botones modulos
    this.botonActivo = false;
    //Establece el boton actualizar en deshabilitado
    this.btnActualizarActivo = false;
    //Obtiene la lista de roles
    this.listarRoles();
    //Obtiene la lista de modulos
    this.listarModulos();
  }
  //Crea el array de subopciones
  private crearSubopciones(elemento): FormGroup {
    return this.fb.group({
      id: elemento.id,
      version: elemento.version,
      nombre: elemento.nombre,
      esABM: elemento.esABM,
      mostrar: elemento.mostrar
    })
  }
  //Obtiene la lista de roles
  private listarRoles(): void {
    this.rolServicio.listar().subscribe(res => {
      this.roles = res.json();
    })
  }
  //Obtiene la lista de modulos
  private listarModulos(): void {
    this.moduloServicio.listar().subscribe(res => {
      this.modulos = res.json();
    })
  }
  //Al seleccionar un modulo
  public seleccionarModulo(id, indice): void {
    this.submoduloServicio.listarPorModulo(id).subscribe(res => {
      this.submodulos = res.json();
      this.estadoSidenav = 2;
      this.nombreTitulo = "SUBMODULOS";
    })
  }
  //Obtiene una lista por rol y submodulo
  public listarPorRolYSubmodulo(submodulo, indice): void {
    this.vaciarSubopciones();
    this.botonOpcionActivo = indice;
    this.btnActualizarActivo = true;
    this.formulario.get('submodulo').setValue(submodulo);
    let rol = this.formulario.get('rol').value;
    this.servicio.listarPorRolYSubopcion(rol.id, submodulo.id).subscribe(res => {
      let rolSubopciones = res.json();
      let subopciones = rolSubopciones.subopciones;
      for (var i = 0; i < subopciones.length; i++) {
        this.subopciones = this.formulario.get('subopciones') as FormArray;
        this.subopciones.push(this.crearSubopciones(subopciones[i]));
      }
    })
  }
  //Vacia la lista de subopciones
  private vaciarSubopciones(): void {
    this.subopciones = this.formulario.get('subopciones') as FormArray;
    while (this.subopciones.length != 0) {
      this.subopciones.removeAt(0);
    }
  }
  //Vuelve a modulos
  public atras(): void {
    this.estadoSidenav = 1;
    this.nombreTitulo = "MODULOS";
    this.submodulos = [];
    this.vaciarSubopciones();
    this.btnActualizarActivo = false;
    this.botonOpcionActivo = -1;

  }
  //Actualiza la lista de subopciones del rol
  public actualizar(): void {
    this.servicio.actualizar(this.formulario.value).subscribe(
      res => {
        let respuesta = res.json();
        if(respuesta.codigo == 200) {
          this.toastr.success(respuesta.mensaje);
        }
      },
      err => {
        let respuesta = err.json();
        this.toastr.error(respuesta.mensaje);
      }
    )
  }
  //Activa los botones de modulos al seleccionar un rol
  public activarBotones(): void {
    this.botonActivo = true;
  }
  //Funcion para comparar y mostrar elemento de campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if (a != null && b != null) {
      return a.id === b.id;
    }
  }
}
