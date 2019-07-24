import { Component, OnInit } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { PlanCuentaService } from 'src/app/servicios/plan-cuenta.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoaderService } from 'src/app/servicios/loader.service';
import { LoaderState } from 'src/app/modelos/loader';
import { Subscription } from 'rxjs';
import { AppService } from 'src/app/servicios/app.service';
import { TipoCuentaContableService } from 'src/app/servicios/tipo-cuenta-contable.service';
import { GrupoCuentaContableService } from 'src/app/servicios/grupo-cuenta-contable.service';

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
  grupoCuentaContable: {};
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
  grupoCuentaContable: {};
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
  public formulario: FormGroup;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Define la lista de tipos de cuentas contables
  public tiposCuentasContables:Array<any> = [];
  //Define la lista de grupos de cuentas contables
  public gruposCuentasContables:Array<any> = [];
  //Define si mostrar tipos de cuentas contables
  public mostrarTipoCuentasContables:boolean = false;
  //Define si se puede modificar esImputable y estaActivo
  public permitirActualizar:boolean = true;
  //Constructor
  constructor(private planCuentaServicio: PlanCuentaService, private appService: AppService,
    private loaderService: LoaderService, private tipoCuentaContableServicio: TipoCuentaContableService,
    private grupoCuentaContableServicio: GrupoCuentaContableService) {
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
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
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
      grupoCuentaContable: new FormControl(),
      nivel: new FormControl(),
      hijos: new FormControl()
    });
    //Obtiene la lista de tipos de cuentas contables
    this.listarTiposCuentasContables();
    //Obtiene la lista de grupos de cuentas contables
    this.listarGruposCuentasContables();
  }
  //Establece valores por defecto
  private establecerValoresPorDefecto(): void {
    this.formulario.get('esImputable').setValue(true);
    this.formulario.get('estaActivo').setValue(true);
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
    flatNode.grupoCuentaContable = node.grupoCuentaContable;
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
    this.formulario.reset();
    setTimeout(function () {
      document.getElementById('idNombre').focus();
    }, 20);
    this.establecerValoresPorDefecto();
    this.mostrarTipoCuentasContables = nodo.nivel == 1 ? true : false;
    this.formulario.get('esImputable').setValue(nodo.nivel == 1 ? false : true);
    const nodoPadre = this.flatNodeMap.get(nodo);
    this.planCuentaServicio.agregarElemento(nodoPadre!, '');
    this.treeControl.expand(nodo);
  }
  //Actualiza un nodo
  public editarNodo(nodo: Nodo) {
    this.permitirActualizar = nodo.esImputable ? true : false;
    nodo.editable = true;
    setTimeout(function () {
      document.getElementById('idNombre').focus();
      if (imputable) {
        document.getElementById('idNombre').classList.remove('upper-case')
        nombre.toLowerCase();
      } else {
        document.getElementById('idNombre').classList.add('upper-case');
        nombre.toUpperCase();
      }
    }, 20);
    this.formulario.patchValue(nodo);
    let nombre = this.formulario.get('nombre').value;
    let imputable = this.formulario.get('esImputable').value;
    if (imputable) {
      this.formulario.get('estaActivo').setValue(true);
      this.formulario.get('estaActivo').disable();
    } else {
      this.formulario.get('estaActivo').setValue(true);
      this.formulario.get('estaActivo').enable();
    }
  }
  //Elimina un nodo
  public eliminarNodo(nodo: Nodo) {
    const nodoPadre = this.obtenerNodoPadre(nodo);
    this.planCuentaServicio.eliminarElemento(nodoPadre!, nodo);
  }
  //Agrega el nodo
  public agregar(nodo: Nodo) {
    this.loaderService.show();
    this.formulario.get('id').setValue(null);
    this.formulario.get('estaActivo').enable();
    const elementoPadre = this.obtenerNodoPadre(nodo);
    const elemento = this.flatNodeMap.get(nodo);
    elemento.esImputable = this.formulario.get('esImputable').value;
    elemento.estaActivo = this.formulario.get('estaActivo').value;
    elemento.nombre = elemento.esImputable ? this.formulario.get('nombre').value : this.formulario.get('nombre').value.toUpperCase();
    elemento.nivel = elementoPadre.nivel + 1;
    elemento.hijos = [];
    elemento.empresa = this.appService.getEmpresa();
    elemento.usuarioAlta = this.appService.getUsuario();
    if(elementoPadre.nivel > 1) {
      elemento.tipoCuentaContable = elementoPadre.tipoCuentaContable;
      elemento.grupoCuentaContable = elementoPadre.grupoCuentaContable;
    } else {
      elemento.tipoCuentaContable = this.formulario.get('tipoCuentaContable').value;
      elemento.grupoCuentaContable = this.formulario.get('grupoCuentaContable').value;
    }
    this.planCuentaServicio.agregar(elemento);
    this.loaderService.hide();
  }
  //Actualiza un nodo
  public actualizar(nodo: Nodo) {
    this.loaderService.show();
    this.formulario.get('estaActivo').enable();
    const aNodo = this.flatNodeMap.get(nodo);
    const nodoPadre = this.obtenerNodoPadre(nodo);
    let padre = {
      id: nodoPadre.id,
      version: nodoPadre.version
    }
    if(nodoPadre.nivel > 1) {
      this.formulario.get('tipoCuentaContable').setValue(nodoPadre.tipoCuentaContable);
      this.formulario.get('grupoCuentaContable').setValue(nodoPadre.grupoCuentaContable);
    }
    this.formulario.get('padre').setValue(padre);
    this.formulario.get('usuarioMod').setValue(this.appService.getUsuario());
    this.planCuentaServicio.actualizar(this.formulario.value, aNodo);
    nodo.editable = false;
    this.loaderService.hide();
  }
  //Elimina el nodo
  public eliminar(nodo: Nodo) {
    this.loaderService.show();
    let aNodo = this.flatNodeMap.get(nodo);
    let pNodo = this.obtenerNodoPadre(nodo);
    this.planCuentaServicio.eliminar(aNodo.id, pNodo);
    this.formulario.reset();
    this.loaderService.hide();
  }
  //Cancela la actualizacion de un nodo
  public cancelar(nodo: Nodo): void {
    this.formulario.reset();
    nodo.editable = false;
  }
  //Evento de cambio de select imputable
  public cambioImputable(): void {
    let nombre = this.formulario.get('nombre').value;
    let imputable = this.formulario.get('esImputable').value;
    if (imputable) {
      document.getElementById('idNombre').classList.remove('upper-case')
      nombre.toLowerCase();
      this.formulario.get('estaActivo').setValue(true);
      this.formulario.get('estaActivo').enable();
    } else {
      document.getElementById('idNombre').classList.add('upper-case');
      nombre.toUpperCase();
      this.formulario.get('estaActivo').setValue(true);
      this.formulario.get('estaActivo').disable();
    }
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
  //Obtiene la lista de tipos de cuentas contables
  public listarTiposCuentasContables(): void {
    this.tipoCuentaContableServicio.listar().subscribe(res => {
      this.tiposCuentasContables = res.json();
    });
  }
  //Obtiene la lista de grupos de cuentas contables
  public listarGruposCuentasContables(): void {
    this.grupoCuentaContableServicio.listar().subscribe(res => {
      this.gruposCuentasContables = res.json();
    });
  }
  //Establece estado (readonly) de campo "Es Imputable"
  public estadoEsImputable(): boolean {
    let estadoFormulario = this.formulario.valid;
    if(this.mostrarTipoCuentasContables) {
      return true;
    } else {
      return !estadoFormulario;
    }
  }
  //Define el mostrado de datos y comparacion en campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if (a != null && b != null) {
      return a.id === b.id;
    }
  }
}