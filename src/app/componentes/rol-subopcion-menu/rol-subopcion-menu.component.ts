import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { RolSubopcionService } from 'src/app/servicios/rol-subopcion.service';
import { RolService } from 'src/app/servicios/rol.service';
import { ModuloService } from 'src/app/servicios/modulo.service';
import { SubmoduloService } from 'src/app/servicios/submodulo.service';

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
  //Define estado de la sidenav, modulo o submodulo
  public estadoSidenav:number;
  //Define el nombre del titulo
  public nombreTitulo:string;
  //Constructor
  constructor(private servicio: RolSubopcionService, private fb: FormBuilder,
    private rolServicio: RolService, private moduloServicio: ModuloService,
    private submoduloServicio: SubmoduloService) { }
  ngOnInit() {
    //Establece el formulario
    this.formulario = this.fb.group({
      rol: new FormControl()
    })
    //Establece por defecto la muestra de la lista de modulo
    this.estadoSidenav = 1;
    //Establece el nombre del titulo
    this.nombreTitulo = 'MODULOS';
    //Obtiene la lista de roles
    this.listarRoles();
    //Obtiene la lista de modulos
    this.listarModulos();
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
  //Vuelve a modulos
  public atras(): void {
    this.estadoSidenav = 1;
    this.nombreTitulo = "MODULOS";
    this.submodulos = [];
  }
  //Funcion para comparar y mostrar elemento de campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if (a != null && b != null) {
      return a.id === b.id;
    }
  }
}
