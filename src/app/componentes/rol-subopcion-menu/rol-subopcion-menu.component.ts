import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { RolSubopcionService } from 'src/app/servicios/rol-subopcion.service';
import { RolService } from 'src/app/servicios/rol.service';
import { ModuloService } from 'src/app/servicios/modulo.service';
import { SubmoduloService } from 'src/app/servicios/submodulo.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { AppService } from 'src/app/servicios/app.service';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { LoaderService } from 'src/app/servicios/loader.service';
import { LoaderState } from 'src/app/modelos/loader';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-rol-subopcion-menu',
  templateUrl: './rol-subopcion-menu.component.html',
  styleUrls: ['./rol-subopcion-menu.component.css']
})
export class RolSubopcionMenuComponent implements OnInit {
  //Define el formulario
  public formulario: FormGroup;
  //Define la lista de roles
  public roles: Array<any> = [];
  //Define la lista de modulos
  public modulos: Array<any> = [];
  //Define la lista de submodulos
  public submodulos: Array<any> = [];
  //Define una lista de subopciones
  public subopciones: FormArray;
  //Define estado de la sidenav, modulo o submodulo
  public estadoSidenav: number;
  //Define el nombre del titulo
  public nombreTitulo: string;
  //Define el submodulo activo
  public botonOpcionActivo: number;
  //Estado de botones modulos
  public botonActivo: boolean;
  //Define el estado del boton actualizar
  public btnActualizarActivo: boolean;
  //Define la lista de pestanias
  public pestanias: Array<any> = [];
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Constructor
  constructor(private servicio: RolSubopcionService, private fb: FormBuilder,
    private rolServicio: RolService, private moduloServicio: ModuloService,
    private submoduloServicio: SubmoduloService, private toastr: ToastrService,
    public dialog: MatDialog, private subopcionPestaniaServicio: SubopcionPestaniaService,
    private appService: AppService, private loaderService: LoaderService,
    private usuarioServicio: UsuarioService) { }
  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
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
      let rol = this.appService.getRol();
      if (rol != 1) {
        this.roles.splice(0, 1);
      }
    })
  }
  //Obtiene la lista de modulos
  private listarModulos(): void {
    this.moduloServicio.listar().subscribe(res => {
      this.modulos = res.json();
      let rol = this.appService.getRol();
      if (rol != 1) {
        this.modulos.splice(0, 1);
      }
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
    this.loaderService.show();
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
      this.loaderService.hide();
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
    this.loaderService.show();
    this.servicio.actualizar(this.formulario.value).subscribe(
      res => {
        let respuesta = res.json();
        if (respuesta.codigo == 200) {
          this.toastr.success(respuesta.mensaje);
          this.loaderService.hide();
        }
      },
      err => {
        let respuesta = err.json();
        this.toastr.error(respuesta.mensaje);
        this.loaderService.hide();
      }
    )
  }
  //Activa los botones de modulos al seleccionar un rol
  public activarBotones(): void {
    this.loaderService.show();
    this.vaciarSubopciones();
    this.atras();
    let rol = this.formulario.get('rol').value;
    //Obtiene la lista de usuario por rol
    this.usuarioServicio.listarPorRol(rol.id).subscribe(res => {
      let listaUsuarios = res.json();
      if(listaUsuarios.length != 0) {
        this.botonActivo = true;
      } else {
        this.botonActivo = false;
        this.toastr.warning('El rol seleccionado no tiene usuarios asignados.');
      }
      this.loaderService.hide();
    })
  }
  //Abre el dialogo usuario para ver los usuarios de un determinado rol
  public verUsuariosDeRol(): void {
    const dialogRef = this.dialog.open(UsuarioDialogo, {
      width: '800px',
      data: { rol: this.formulario.get('rol') }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('Diálogo Usuarios Cerrado!');
    });
  }
  //Abre el dialogo vista previa para visualizar el menu del rol
  public verVistaPrevia(): void {
    const dialogRef = this.dialog.open(VistaPreviaDialogo, {
      width: '1200px',
      data: { rol: this.formulario.get('rol') }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('Diálogo Vista Previa Cerrado!');
    });
  }
  //Abre el dialogo vista previa para visualizar el menu del rol
  public verPestaniasDialogo(subopcion, pestanias): void {
    const dialogRef = this.dialog.open(PestaniaDialogo, {
      width: '1200px',
      data: {
        rol: this.formulario.get('rol'),
        subopcion: subopcion,
        pestanias: pestanias
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('Diálogo Pestanias Cerrado!');
    });
  }
  //Visualiza las pestanias de una subopcion para actualizar estado
  public verPestanias(subopcion): void {
    let rol = this.formulario.get('rol').value;
    this.subopcionPestaniaServicio.obtenerPestaniasPorRolYSubopcion(rol.id, subopcion.id).subscribe(res => {
      this.pestanias = res.json();
      this.verPestaniasDialogo(subopcion, this.pestanias);
    })
  }
  //Funcion para comparar y mostrar elemento de campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if (a != null && b != null) {
      return a.id === b.id;
    }
  }
  //Establece el control de subopcion para checkbox
  get controlSubopciones() { 
    return <FormArray>this.formulario.get('subopciones'); 
  }
}
//Componente Usuarios
@Component({
  selector: 'usuario-dialogo',
  templateUrl: 'usuario-dialogo.html'
})
export class UsuarioDialogo {
  //Define el nombre del rol
  public nombreRol: string;
  //Define la lista de usuario del rol
  public listaUsuarios: Array<any> = [];
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Constructor
  constructor(public dialogRef: MatDialogRef<UsuarioDialogo>, @Inject(MAT_DIALOG_DATA) public data,
    private usuarioServicio: UsuarioService, private loaderService: LoaderService, private toastr: ToastrService) { }
  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    this.loaderService.show();
    let rol = this.data.rol.value;
    //Establece el nombre del rol
    this.nombreRol = rol.nombre;
    //Obtiene la lista de usuario por rol
    this.usuarioServicio.listarPorRol(rol.id).subscribe(
      res => {
        this.listaUsuarios = res.json();
        if(this.listaUsuarios.length == 0) {
          this.toastr.warning('El rol seleccionado no tiene usuarios asignados.');
          this.dialogRef.close();
        }
        this.loaderService.hide();
      },
      err => {
        this.loaderService.hide();
      });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
//Componente Vista Previa
@Component({
  selector: 'vista-previa-dialogo',
  templateUrl: 'vista-previa-dialogo.html'
})
export class VistaPreviaDialogo {
  //Define el rol
  public rol: any;
  //Define la lista de pestanias
  public pestanias: Array<any> = [];
  //Define la lista de modulos del rol
  public modulos: Array<any> = [];
  //Define el nombre de la subopcion
  public nombreSubopcion: string;
  //Define el nombre del rol
  public nombreRol: string;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Constructor
  constructor(public dialogRef: MatDialogRef<VistaPreviaDialogo>, @Inject(MAT_DIALOG_DATA) public data,
    private appServicio: AppService, private subopcionPestaniaService: SubopcionPestaniaService,
    private loaderService: LoaderService, private toastr: ToastrService) { }
  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    this.loaderService.show();
    this.rol = this.data.rol.value;
    this.nombreRol = this.rol.nombre;
    this.appServicio.obtenerMenu(this.rol.id, localStorage.getItem('token')).subscribe(
      res => {
        this.modulos = res.json().modulos;
        this.loaderService.hide();
      },
      err => {
        this.toastr.warning('El rol seleccionado no tiene subopciones asignadas.');
        this.loaderService.hide();
        this.dialogRef.close();
      });
  }
  public obtenerPestanias(subopcion): void {
    this.loaderService.show();
    this.nombreSubopcion = subopcion.subopcion;
    //Obtiene la lista de pestania por rol y subopcion
    this.subopcionPestaniaService.listarPorRolSubopcion(this.rol.id, subopcion.id).subscribe(res => {
      this.pestanias = res.json();
      this.loaderService.hide();
    })
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
//Componente Pestañas
@Component({
  selector: 'pestania-dialogo',
  templateUrl: 'pestania-dialogo.html'
})
export class PestaniaDialogo {
  //Define el formulario
  public formulario: FormGroup;
  //Define la lista de pestanias
  public pestanias: FormArray;
  //Define el nombre de la subopcion
  public nombreSubopcion: string;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Define el tema
  public tema:string;
  //Constructor
  constructor(public dialogRef: MatDialogRef<PestaniaDialogo>, @Inject(MAT_DIALOG_DATA) public data,
    private fb: FormBuilder, private servicio: SubopcionPestaniaService, private toastr: ToastrService,
    private loaderService: LoaderService, private appService: AppService) { }
  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    //Establece el tema
    this.tema = this.appService.getTema();
    //Define datos pasado por parametro al dialogo
    let pestanias = this.data.pestanias.pestanias
    let rol = this.data.rol.value;
    let subopcion = this.data.subopcion;
    //Establece el nombre de la subopcion
    this.nombreSubopcion = subopcion.nombre;
    //Establece el formulario
    this.formulario = this.fb.group({
      rol: new FormControl,
      subopcion: new FormControl,
      pestanias: this.fb.array([])
    })
    this.formulario.get('rol').setValue(rol);
    this.formulario.get('subopcion').setValue(subopcion);
    for (var i = 0; i < pestanias.length; i++) {
      this.pestanias = this.formulario.get('pestanias') as FormArray;
      this.pestanias.push(this.crearPestanias(pestanias[i]));
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  //Crea el array de pestanias
  private crearPestanias(elemento): FormGroup {
    return this.fb.group({
      id: elemento.id,
      version: elemento.version,
      nombre: elemento.nombre,
      mostrar: elemento.mostrar
    })
  }
  //Actualiza la lista de pestanias de la subopcion
  public actualizar(): void {
    this.loaderService.show();
    this.servicio.actualizar(this.formulario.value).subscribe(
      res => {
        let respuesta = res.json();
        if (respuesta.codigo == 200) {
          this.toastr.success(respuesta.mensaje);
          this.loaderService.hide();
        }
      },
      err => {
        let respuesta = err.json();
        this.toastr.error(respuesta.mensaje);
        this.loaderService.hide();
      }
    )
  }
  //Establece control para lista pestania con checkbox
  get controlPestanias() { 
    return <FormArray>this.formulario.get('pestanias'); 
  }
}