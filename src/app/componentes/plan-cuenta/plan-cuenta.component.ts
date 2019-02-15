import { Component, Injectable } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { BehaviorSubject } from 'rxjs';
import { PlanCuentaService } from 'src/app/servicios/plan-cuenta.service';
import { AppComponent } from 'src/app/app.component';

export class Arbol {
  id: number;
  nombre: string;
  esImputable: boolean;
  estaActivo: boolean;
  padre: Arbol;
  empresa: {};
  usuarioAlta: {};
  hijos: Arbol[];
}

// export class Arbol {
//   children: Arbol[];
//   item: string;
//   // esImputable: boolean;
//   // estaActivo: boolean;
// }

export class Nodo {
  id: number;
  nombre: string;
  esImputable: boolean;
  estaActivo: boolean;
  padre: Arbol;
  empresa: {};
  usuarioAlta: {};
  level: number;
  expandable: boolean;
}

// const TREE_DATA = {
//   '/': {
//     Activo: {
//       Lenguajes: [
//         'sql', 'java', 'angular'
//       ]
//     },
//     Pasivo: {

//     }
//   }
// };

// @Injectable()
// export class ChecklistDatabase {
//   dataChange = new BehaviorSubject<Arbol[]>([]);
//   public planCuenta:any;
//   get data(): Arbol[] { return this.dataChange.value; }

//   constructor(private planCuentaServicio: PlanCuentaService) {
//     this.planCuentaServicio.obtenerPlanCuenta().subscribe(res => {
//       this.initialize(res.json());
//     });
//   }

//   initialize(planCuenta) {
//     // const d = this.buildFileTree(TREE_DATA, 0);
//     const data = this.crearArbol(planCuenta);
//     let arbol = [];
//     arbol.push(data);
//     this.dataChange.next(arbol);
//   }

//   private crearArbol(elemento): Arbol {
//     let arbol = new Arbol();
//     arbol.id = elemento.id;
//     arbol.nombre = elemento.nombre;
//     arbol.esImputable = elemento.esImputable;
//     arbol.estaActivo = elemento.estaActivo;
//     arbol.hijos = elemento.hijos;
//     for (const i in arbol.hijos) {
//       arbol.hijos[i] = this.crearArbol(arbol.hijos[i]);
//     }
//     return arbol;
//   }

//   buildFileTree(obj: { [key: string]: any }, level: number): Arbol[] {
//     return Object.keys(obj).reduce<Arbol[]>((accumulator, key) => {
//       const value = obj[key];
//       const node = new Arbol();
//       node.item = key;
//       if (value != null) {
//         if (typeof value === 'object') {
//           node.children = this.buildFileTree(value, level + 1);
//         } else {
//           node.item = obj[key];
//         }
//       }
//       return accumulator.concat(node);
//     }, []);
//   }

//   insertItem(parent: Arbol, name: string) {
//     if (parent.hijos) {
//       parent.hijos.push({ nombre: name } as Arbol);
//       this.dataChange.next(this.data);
//     }
//   }

//   updateItem(nodo: Arbol, nombre: string, imputable: boolean, activo: boolean, idPadre: number) {
//     nodo.nombre = nombre;
//     nodo.esImputable = imputable;
//     nodo.estaActivo = activo;
//     nodo.padre.id = idPadre;
//     nodo.hijos = [];
//     this.planCuentaServicio.agregar(nodo).subscribe(
//       res => {
//         this.dataChange.next(this.data);
//       },
//       err => {

//       }
//     );
//   }

//   deleteItem(node: Arbol) {
//     node.nombre = null;
//     this.dataChange.next(this.data);
//   }
// }

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
    flatNode.usuarioAlta = {};
    flatNode.expandable = !!node.hijos;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }

  getParentNode(node: Nodo): Nodo | null {
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

  addNewItem(nodo: Nodo) {
    const nodoPadre = this.flatNodeMap.get(nodo);
    this.planCuentaServicio.agregarElemento(nodoPadre!, '');
    //this.database.insertItem(parentNode!, '');
    this.treeControl.expand(nodo);
  }

  saveNode(nodo: Nodo, nombre: string, imputable: boolean, activo: boolean) {
    const elemento = this.flatNodeMap.get(nodo);
    elemento.nombre = nombre;
    elemento.esImputable = imputable;
    elemento.estaActivo = activo;
    elemento.hijos = [];
    elemento.empresa = this.appComponent.getEmpresa();
    elemento.usuarioAlta = this.appComponent.getUsuario();
    this.planCuentaServicio.agregar(elemento);
    // this.database.updateItem(nestedNode!, nombre, imputable, activo, this.idPadre);
  }

  deleteNode(node: Nodo) {
    let nestedNode = this.flatNodeMap.get(node);
    this.planCuentaServicio.eliminar(nestedNode.id);
  }
}