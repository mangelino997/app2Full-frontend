import { Component, Injectable } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { BehaviorSubject } from 'rxjs';
import { PlanCuentaService } from 'src/app/servicios/plan-cuenta.service';

export class Arbol {
  nombre: string;
  hijos: Arbol[];
}

// export class Arbol {
//   children: Arbol[];
//   item: string;
//   // esImputable: boolean;
//   // estaActivo: boolean;
// }

export class TodoItemFlatNode {
  item: string;
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

@Injectable()
export class ChecklistDatabase {
  dataChange = new BehaviorSubject<Arbol[]>([]);
  public planCuenta:any;
  get data(): Arbol[] { return this.dataChange.value; }

  constructor(private planCuentaServicio: PlanCuentaService) {
    this.planCuentaServicio.obtenerPlanCuenta().subscribe(res => {
      this.initialize(res.json());
    });
  }

  initialize(planCuenta) {
    // const d = this.buildFileTree(TREE_DATA, 0);
    const data = this.crearArbol(planCuenta);
    console.log(data);
    let arbol = [];
    arbol.push(data);
    this.dataChange.next(arbol);
  }

  private crearArbol(elemento): Arbol {
    let arbol = new Arbol();
    arbol.nombre = elemento.nombre;
    arbol.hijos = elemento.hijos;
    for (const i in arbol.hijos) {
      arbol.hijos[i] = this.crearArbol(arbol.hijos[i]);
    }
    return arbol;
  }

  // buildFileTree(obj: { [key: string]: any }, level: number): Arbol[] {
  //   return Object.keys(obj).reduce<Arbol[]>((accumulator, key) => {
  //     const value = obj[key];
  //     const node = new Arbol();
  //     node.item = key;
  //     if (value != null) {
  //       if (typeof value === 'object') {
  //         node.children = this.buildFileTree(value, level + 1);
  //       } else {
  //         node.item = obj[key];
  //       }
  //     }
  //     return accumulator.concat(node);
  //   }, []);
  // }

  insertItem(parent: Arbol, name: string) {
    if (parent.hijos) {
      parent.hijos.push({ nombre: name } as Arbol);
      this.dataChange.next(this.data);
    }
  }

  updateItem(node: Arbol, name: string) {
    node.nombre = name;
    this.dataChange.next(this.data);
  }

  deleteItem(node: Arbol) {
    node.nombre = null;
    this.dataChange.next(this.data);
  }
}

@Component({
  selector: 'app-plan-cuenta',
  templateUrl: './plan-cuenta.component.html',
  styleUrls: ['./plan-cuenta.component.css']
})
export class PlanCuentaComponent {
  flatNodeMap = new Map<TodoItemFlatNode, Arbol>();
  nestedNodeMap = new Map<Arbol, TodoItemFlatNode>();
  selectedParent: TodoItemFlatNode | null = null;
  newItemName = '';
  treeControl: FlatTreeControl<TodoItemFlatNode>;
  treeFlattener: MatTreeFlattener<Arbol, TodoItemFlatNode>;
  dataSource: MatTreeFlatDataSource<Arbol, TodoItemFlatNode>;

  constructor(private database: ChecklistDatabase) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
      this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    database.dataChange.subscribe(data => {
      this.dataSource.data = data;
    });
  }

  getLevel = (node: TodoItemFlatNode) => node.level;

  isExpandable = (node: TodoItemFlatNode) => node.expandable;

  getChildren = (node: Arbol): Arbol[] => node.hijos;

  hasChild = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.item === '';

  transformer = (node: Arbol, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.item === node.nombre
      ? existingNode
      : new TodoItemFlatNode();
    flatNode.item = node.nombre;
    flatNode.level = level;
    flatNode.expandable = !!node.hijos;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }

  getParentNode(node: TodoItemFlatNode): TodoItemFlatNode | null {
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

  addNewItem(node: TodoItemFlatNode) {
    const parentNode = this.flatNodeMap.get(node);
    this.database.insertItem(parentNode!, '');
    this.treeControl.expand(node);
  }

  saveNode(node: TodoItemFlatNode, itemValue: string) {
    const nestedNode = this.flatNodeMap.get(node);
    this.database.updateItem(nestedNode!, itemValue);
  }

  deleteNode(node: TodoItemFlatNode) {
    const nestedNode = this.flatNodeMap.get(node);
    this.database.deleteItem(nestedNode!);
  }
}