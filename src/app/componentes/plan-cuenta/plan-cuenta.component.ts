import { Component } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { PlanCuentaService } from 'src/app/servicios/plan-cuenta.service';
import { AppComponent } from 'src/app/app.component';
import { FormGroup } from '@angular/forms';

export class Arbol {
  id: number;
  nombre: string;
  esImputable: boolean;
  estaActivo: boolean;
  padre: Arbol;
  empresa: {};
  nivel: number;
  usuarioAlta: {};
  hijos: Arbol[];
}

export class Nodo {
  id: number;
  nombre: string;
  esImputable: boolean;
  estaActivo: boolean;
  padre: Arbol;
  empresa: {};
  nivel: number;
  usuarioAlta: {};
  hijos: Arbol[];
  level: number;
  expandable: boolean;
  mostrarBotones: boolean;
}

@Component({
  selector: 'app-plan-cuenta',
  templateUrl: './plan-cuenta.component.html',
  styleUrls: ['./plan-cuenta.component.css']
})
export class PlanCuentaComponent {
  flatNodeMap = new Map<Nodo, Arbol>();
  nestedNodeMap = new Map<Arbol, Nodo>();
  selectedParent: Nodo | null = null;
  newItemName = '';
  treeControl: FlatTreeControl<Nodo>;
  treeFlattener: MatTreeFlattener<Arbol, Nodo>;
  //Defiene los datos del plan de cuenta
  datos: MatTreeFlatDataSource<Arbol, Nodo>;
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
    flatNode.nombre = node.nombre;
    flatNode.level = level;
    flatNode.esImputable = node.esImputable;
    flatNode.estaActivo = node.estaActivo;
    flatNode.empresa = {};
    flatNode.nivel = node.nivel;
    flatNode.usuarioAlta = {};
    flatNode.hijos = node.hijos;
    flatNode.expandable = !!node.hijos;
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
  //Elimina un nodo
  public eliminarNodo(nodo: Nodo) {
    const nodoPadre = this.obtenerNodoPadre(nodo);
    this.planCuentaServicio.eliminarElemento(nodoPadre!, nodo);
    // this.treeControl.expand(nodo);
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
  //Elimina el nodo
  public eliminar(nodo: Nodo) {
    let aNodo = this.flatNodeMap.get(nodo);
    let pNodo = this.obtenerNodoPadre(nodo);
    this.planCuentaServicio.eliminar(aNodo.id, pNodo);
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