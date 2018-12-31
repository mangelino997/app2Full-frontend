import { Component, OnInit } from '@angular/core';
import { UsuarioEmpresaService } from 'src/app/servicios/usuario-empresa.service';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { UsuarioEmpresa } from 'src/app/modelos/usuarioEmpresa';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-usuario-empresas',
  templateUrl: './usuario-empresas.component.html',
  styleUrls: ['./usuario-empresas.component.css']
})
export class UsuarioEmpresasComponent implements OnInit {
  //Define el formulario
  public formulario: FormGroup;
  //Define la lista de resultados usuarios
  public resultadosUsuarios: Array<any> = [];
  //Define la pestania activa
  public pestaniaActiva: string;
  //Define el indice de pestania seleccionado
  public indiceSeleccionado: number;
  //Define la lista de empresas del usuario
  public listaEmpresas: Array<any> = [];
  //Define los elementos A de la primera tabla
  public empresas: FormArray;
  //Constructor
  constructor(private usuarioEmpresaServicio: UsuarioEmpresaService, private usuarioEmpresaModelo: UsuarioEmpresa,
    private usuarioServicio: UsuarioService, private fb: FormBuilder, private toastr: ToastrService) { }
  ngOnInit() {
    //Establece el formulario
    this.formulario = this.fb.group({
      id: new FormControl(),
      version: new FormControl(),
      usuario: new FormControl(),
      empresas: this.fb.array([])
    })
    //Establece la pestania actual activa por defecto
    this.seleccionarPestania(1, 'Actualizar');
    //Autocompleta Usuario - Buscar por nombre
    this.formulario.get('usuario').valueChanges.subscribe(data => {
      if (typeof data == 'string') {
        this.usuarioServicio.listarPorNombre(data).subscribe(res => {
          this.resultadosUsuarios = res;
        })
      }
    })
  }
  //Crea el elemento B (form) para la segunda tabla
  private crearEmpresa(elemento): FormGroup {
    return this.fb.group({
      id: elemento.empresa.id,
      version: elemento.empresa.version,
      razonSocial: elemento.empresa.razonSocial,
      abreviatura: elemento.empresa.abreviatura,
      mostrar: elemento.mostrar
    })
  }
  //Establece la pestania actual
  public seleccionarPestania(indice, pestania) {
    //Establece el indice
    this.indiceSeleccionado = indice;
    //Establece la pestania activa
    this.pestaniaActiva = pestania;
  }
  //Obtiene las empresas del usuario
  public obtenerEmpresas(): void {
    this.vaciarEmpresas();
    if (this.formulario.get('empresas').value.length == 0) {
      let idUsuario = this.formulario.get('usuario').value.id;
      this.usuarioEmpresaServicio.listarPorUsuario(idUsuario).subscribe(res => {
        this.listaEmpresas = res.json();
        for (var i = 0; i < this.listaEmpresas.length; i++) {
          this.empresas = this.formulario.get('empresas') as FormArray;
          this.empresas.push(this.crearEmpresa(this.listaEmpresas[i]));
        }
      })
    }
  }
  //Actualiza la lista de empresas del usuario
  public actualizar(): void {
    let usuario = this.formulario.value.usuario;
    usuario.empresas = this.formulario.value.empresas;
    this.usuarioEmpresaServicio.actualizar(usuario).subscribe(
      res => {
        let respuesta = res.json();
        this.resultadosUsuarios = [];
        this.formulario.reset();
        this.vaciarEmpresas();
        document.getElementById('idUsuario').focus();
        this.toastr.success(respuesta.mensaje);
      },
      err => {
        let respuesta = err.json();
        this.toastr.success(respuesta.mensaje);
      }
    )
  }
  //Vacia la lista de empresas
  private vaciarEmpresas(): void {
    this.empresas = this.formulario.get('empresas') as FormArray;
    while (this.empresas.length != 0) {
      this.empresas.removeAt(0);
    }
  }
  //Define como se muestra los datos en el autcompletado
  public displayFn(elemento) {
    if (elemento != undefined) {
      return elemento.nombre ? elemento.nombre : elemento;
    } else {
      return elemento;
    }
  }
  //Maneja los evento al presionar una tacla (para pestanias y opciones)
  public manejarEvento(keycode) {
    // var indice = this.indiceSeleccionado;
    // if(keycode == 113) {
    //   if(indice < this.pestanias.length) {
    //     this.seleccionarPestania(indice+1, this.pestanias[indice].nombre, 0);
    //   } else {
    //     this.seleccionarPestania(1, this.pestanias[0].nombre, 0);
    //   }
    // }
  }
}