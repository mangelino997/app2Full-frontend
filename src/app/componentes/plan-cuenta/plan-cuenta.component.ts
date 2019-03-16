import { Component, OnInit } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { PlanCuentaService } from 'src/app/servicios/plan-cuenta.service';
import { AppComponent } from 'src/app/app.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';

export class Arbol {
  id: number;
  version: number;
  empresa: {};
  padre: Arbol;
  nombre: string;
  esImputable: boolean;
  estaActivo: boolean;
  usuarioAlta: {};
  usuarioMod: {};
  tipoCuentaContable: {};
  nivel: number;
  hijos: Arbol[];
}

export class Nodo {
  id: number;
  version: number;
  empresa: {};
  padre: Arbol;
  nombre: string;
  esImputable: boolean;
  estaActivo: boolean;
  usuarioAlta: {};
  usuarioMod: {};
  tipoCuentaContable: {};
  nivel: number;
  hijos: Arbol[];
  level: number;
  expandable: boolean;
  editable: boolean;
  mostrarBotones: boolean;
}

@Component({
  selector: 'app-plan-cuenta',
  templateUrl: './plan-cuenta.component.html',
  styleUrls: ['./plan-cuenta.component.css']
})
export class PlanCuentaComponent implements OnInit {
  flatNodeMap = new Map<Nodo, Arbol>();
  nestedNodeMap = new Map<Arbol, Nodo>();
  selectedParent: Nodo | null = null;
  newItemName = '';
  treeControl: FlatTreeControl<Nodo>;
  treeFlattener: MatTreeFlattener<Arbol, Nodo>;
  //Defiene los datos del plan de cuenta
  datos: MatTreeFlatDataSource<Arbol, Nodo>;
  //Define el formulario
  public formulario:FormGroup;
  //Constructor
  constructor(private planCuentaServicio: PlanCuentaService, private appComponent: AppComponent) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
      this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<Nodo>(this.getLevel, this.isExpandable);
    this.datos = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this.planCuentaServicio.listaCompleta.subscribe(data => {
      this.datos.data = data;
    });
  }
  //Al inicializarse el componente
  ngOnInit(): void {
    //Establece el formulario
    this.formulario = new FormGroup({
      id: new FormControl(),
      version: new FormControl(),
      empresa: new FormControl(),
      padre: new FormControl(),
      nombre: new FormControl('', Validators.required),
      esImputable: new FormControl('', Validators.required),
      estaActivo: new FormControl('', Validators.required),
      usuarioAlta: new FormControl(),
      usuarioMod: new FormControl(),
      tipoCuentaContable: new FormControl(),
      nivel: new FormControl(),
      hijos: new FormControl()
    });
  }

  getLevel = (node: Nodo) => node.level;

  isExpandable = (node: Nodo) => node.expandable;

  getChildren = (node: Arbol): Arbol[] => node.hijos;

  hasChild = (_: number, _nodeData: Nodo) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: Nodo) => _nodeData.nombre === '';

  transformer = (node: Arbol, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.nombre === node.nombre
      ? existingNode
      : new Nodo();
    flatNode.id = node.id;
    flatNode.version = node.version;
    flatNode.empresa = node.empresa;
    flatNode.padre = node.padre;
    flatNode.nombre = node.nombre;
    flatNode.esImputable = node.esImputable;
    flatNode.estaActivo = node.estaActivo;
    flatNode.usuarioAlta = node.usuarioAlta;
    flatNode.usuarioMod = node.usuarioMod;
    flatNode.tipoCuentaContable = node.tipoCuentaContable;
    flatNode.nivel = node.nivel;
    flatNode.hijos = node.hijos;
    flatNode.level = level;
    flatNode.expandable = !!node.hijos;
    flatNode.editable = false;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }
  //Obtiene el nodo padre de un nodo
  private obtenerNodoPadre(node: Nodo): Nodo | null {
    const currentLevel = this.getLevel(node);
    if (currentLevel < 1) {
      return null;
    }
    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;
    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];
      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }
  //Crea un nuevo nodo
  public nuevoNodo(nodo: Nodo) {
    const nodoPadre = this.flatNodeMap.get(nodo);
    this.planCuentaServicio.agregarElemento(nodoPadre!, '');
    this.treeControl.expand(nodo);
  }
  //Actualiza un nodo
  public editarNodo(nodo: Nodo) {
    nodo.editable = true;
    setTimeout(function() {
      document.getElementById('idNombreF').focus();
    }, 20);
    this.formulario.patchValue(nodo);
  }
  //Elimina un nodo
  public eliminarNodo(nodo: Nodo) {
    const nodoPadre = this.obtenerNodoPadre(nodo);
    this.planCuentaServicio.eliminarElemento(nodoPadre!, nodo);
  }
  //Agrega el nodo
  public agregar(nodo: Nodo, nombre: string, imputable: boolean, activo: boolean) {
    const elementoPadre = this.obtenerNodoPadre(nodo);
    const elemento = this.flatNodeMap.get(nodo);
    elemento.nombre = nombre;
    elemento.esImputable = imputable;
    elemento.estaActivo = activo;
    elemento.nivel = elementoPadre.nivel+1;
    elemento.hijos = [];
    elemento.empresa = this.appComponent.getEmpresa();
    elemento.usuarioAlta = this.appComponent.getUsuario();
    this.planCuentaServicio.agregar(elemento);
  }
  //Actualiza un nodo
  public actualizar(nodo: Nodo) {
    const aNodo = this.flatNodeMap.get(nodo);
    const nodoPadre = this.obtenerNodoPadre(nodo);
    let padre = {
      id: nodoPadre.id,
      version: nodoPadre.version
    }
    this.formulario.get('padre').setValue(padre);
    this.planCuentaServicio.actualizar(this.formulario.value, aNodo);
    nodo.editable = false;
  }
  //Elimina el nodo
  public eliminar(nodo: Nodo) {
    let aNodo = this.flatNodeMap.get(nodo);
    let pNodo = this.obtenerNodoPadre(nodo);
    this.planCuentaServicio.eliminar(aNodo.id, pNodo);
  }
  //Cancela la actualizacion de un nodo
  public cancelar(nodo: Nodo): void {
    nodo.editable = false;
  }
  //Evento de cambio de select imputable
  public cambioImputable(imputable, nombre): void {
    console.log('PSO');
    nombre = imputable ? nombre.toLowerCase() : nombre.toUpperCase();
  }
  //Activa los botones de nuevo y eliminar node
  public activarBotones(nodo): void {
    nodo.mostrarBotones = true;
  }
  //Desactiva los botones de nuevo y eliminar node
  public desactivarBotones(nodo): void {
    nodo.mostrarBotones = false;
  }
  //Obtiene el estado del boton agregar
  public obtenerEstadoBoton(nombre, imputable, activo) {
    return nombre.value != null && imputable.value != null && activo.value != null ? true : false;
  }
}