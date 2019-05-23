import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { SubopcionPestaniaService } from '../../servicios/subopcion-pestania.service';
import { FormGroup, FormControl } from '@angular/forms';
import { MonedaCuentaContable } from 'src/app/modelos/moneda-cuenta-contable';
import { MonedaCuentaContableService } from 'src/app/servicios/moneda-cuenta-contable.service';
import { PlanCuentaService } from 'src/app/servicios/plan-cuenta.service';
import { MonedaService } from 'src/app/servicios/moneda.service';
import { EmpresaService } from 'src/app/servicios/empresa.service';
import { MatSort, MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material';
import { LoaderService } from 'src/app/servicios/loader.service';
import { LoaderState } from 'src/app/modelos/loader';
import { Subscription } from 'rxjs';
import { AppService } from 'src/app/servicios/app.service';
import { FlatTreeControl } from '@angular/cdk/tree';

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
  selector: 'app-moneda-cuenta-contable',
  templateUrl: './moneda-cuenta-contable.component.html',
  styleUrls: ['./moneda-cuenta-contable.component.css']
})
export class MonedaCuentaContableComponent implements OnInit {
  //Define la pestania activa
  public activeLink: any = null;
  //Define el indice seleccionado de pestania
  public indiceSeleccionado: number = null;
  //Define la pestania actual seleccionada
  public pestaniaActual: string = null;
  //Define si mostrar el autocompletado
  public mostrarAutocompletado: boolean = null;
  //Define si el campo es de solo lectura
  public soloLectura: boolean = false;
  //Define si mostrar el boton
  public mostrarBoton: boolean = null;
  //Define la lista de pestanias
  public pestanias: Array<any> = [];
  //Define un formulario para validaciones de campos
  public formulario: FormGroup;
  //Define la lista completa de registros
  public listaCompleta = new MatTableDataSource([]);
  //Define la lista de Monedas
  public listaMonedas: Array<any> = [];
  //Define la lista de Empresas
  public listaEmpresas: Array<any> = [];
  //Define el autocompletado
  public autocompletado: FormControl = new FormControl();
  //Define empresa para las busquedas
  public empresaBusqueda: FormControl = new FormControl();
  //Define la lista de resultados de busqueda
  public resultados: Array<any> = [];
  //Define la lista de resultados de busqueda companias seguros
  public resultadosCompaniasSeguros: Array<any> = [];
  //Defien la lista de empresas
  public empresas: Array<any> = [];
  //Define las columnas de la tabla
  public columnas: string[] = ['moneda', 'empresa', 'cuentaContable'];
  //Define la matSort
  @ViewChild(MatSort) sort: MatSort;
  //Define el mostrar del circulo de progreso
  public show = false;
  //Define la subscripcion a loader.service
  private subscription: Subscription;
  //Constructor
  constructor(private monedaCuentaContableServicio: MonedaCuentaContableService, private monedaCuentaContable: MonedaCuentaContable,
    private planCuentaServicio: PlanCuentaService, private subopcionPestaniaService: SubopcionPestaniaService, private monedaServicio: MonedaService,
    private empresaServicio: EmpresaService, private loaderService: LoaderService, private appService: AppService,
    public dialog: MatDialog) {
    //Obtiene la lista de pestanias
    this.subopcionPestaniaService.listarPorRolSubopcion(this.appService.getRol().id, this.appService.getSubopcion())
      .subscribe(
        res => {
          this.pestanias = res.json();
          this.activeLink = this.pestanias[0].nombre;
        },
        err => {
          console.log(err);
        }
      );
    //Controla el autocompletado
    this.autocompletado.valueChanges.subscribe(data => {
      if (typeof data == 'string' && data.length > 2) {
        this.monedaCuentaContableServicio.listarPorMoneda(data).subscribe(res => {
          this.resultados = res.json();
          console.log(res.json());
        })
      }
    });
  }
  ngOnInit() {
    //Establece la subscripcion a loader
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
    //Define el formulario y validaciones
    this.formulario = this.monedaCuentaContable.formulario;
    //Establece los valores de la primera pestania activa
    this.seleccionarPestania(1, 'Agregar', 0);
    //Lista las Monedas Cuentas Contables
    // this.listar();
    //Carga select con la lista de Monedas
    this.listarMonedas();
    //Carga select con la lista de Empresas
    this.listarEmpresas();
  }
  //Obtiene el listado de registros
  private listar() {
    this.loaderService.show();
    this.monedaCuentaContableServicio.listar().subscribe(
      res => {
        this.listaCompleta = new MatTableDataSource(res.json());
        this.listaCompleta.sort = this.sort;
        this.loaderService.hide();
      },
      err => {
        console.log(err);
        this.loaderService.hide();
      }
    );
  }
  //Obtiene el listado de registros
  private listarMonedas() {
    this.monedaServicio.listar().subscribe(
      res => {
        this.listaMonedas = res.json();
      },
      err => {
        console.log(err);
      }
    );
  }//Obtiene el listado de registros
  private listarEmpresas() {
    this.empresaServicio.listar().subscribe(
      res => {
        this.listaEmpresas = res.json();
      },
      err => {
        console.log(err);
      }
    );
  }
  //Funcion para establecer los valores de las pestañas
  private establecerValoresPestania(nombrePestania, autocompletado, soloLectura, boton, componente) {
    this.pestaniaActual = nombrePestania;
    this.mostrarAutocompletado = autocompletado;
    this.soloLectura = soloLectura;
    this.mostrarBoton = boton;
    setTimeout(function () {
      document.getElementById(componente).focus();
    }, 20);
  };
  //Establece valores al seleccionar una pestania
  public seleccionarPestania(id, nombre, opcion) {
    this.formulario.reset();
    this.indiceSeleccionado = id;
    this.activeLink = nombre;
    /*
    * Se vacia el formulario solo cuando se cambia de pestania, no cuando
    * cuando se hace click en ver o mod de la pestania lista
    */
    if (opcion == 0) {
      this.autocompletado.setValue(undefined);
      this.resultados = [];
    }
    switch (id) {
      case 1:
        // this.obtenerSiguienteId();
        this.establecerEstadoCampos(true);
        this.establecerValoresPestania(nombre, false, false, true, 'idMoneda');
        break;
      case 2:
        this.establecerEstadoCampos(false);
        this.establecerValoresPestania(nombre, true, true, false, 'idAutocompletado');
        break;
      case 3:
        this.establecerEstadoCampos(true);
        this.establecerValoresPestania(nombre, true, false, true, 'idAutocompletado');
        break;
      case 4:
        this.establecerEstadoCampos(false);
        this.establecerValoresPestania(nombre, true, true, true, 'idAutocompletado');
        break;
      case 5:
        this.listar();
        break;
      default:
        break;
    }
  }
  //Habilita o deshabilita los campos dependiendo de la pestaña
  private establecerEstadoCampos(estado) {
    if (estado) {
      this.formulario.get('moneda').enable();
      this.formulario.get('empresa').enable();
      this.formulario.get('cuentaContable').enable();
    } else {
      this.formulario.get('moneda').disable();
      this.formulario.get('empresa').disable();
      this.formulario.get('cuentaContable').enable();
    }
  }
  //Funcion para determina que accion se requiere (Agregar, Actualizar, Eliminar)
  // public accion(indice) {
  //   switch (indice) {
  //     case 1:
  //       this.agregar();
  //       break;
  //     case 3:
  //       this.actualizar();
  //       break;
  //     case 4:
  //       this.eliminar();
  //       break;
  //     default:
  //       break;
  //   }
  // }
  //Reestablece los campos formularios
  private reestablecerFormulario(id) {
    this.formulario.reset();
    this.formulario.get('id').setValue(id);
    this.autocompletado.setValue(undefined);
    this.resultados = [];
    setTimeout(function () {
      document.getElementById('idNombre').focus();
    }, 20);
  }
  //Manejo de colores de campos y labels
  public cambioCampo(id, label) {
    document.getElementById(id).classList.remove('is-invalid');
    document.getElementById(label).classList.remove('label-error');
  };
  //Establece el formulario al seleccionar elemento del autocompletado
  public cambioAutocompletado() {
    var elemento = this.autocompletado.value;
    this.autocompletado.setValue(elemento);
    this.formulario.patchValue(elemento);
  }
  //Muestra en la pestania buscar el elemento seleccionado de listar
  public activarConsultar(elemento) {
    this.seleccionarPestania(2, this.pestanias[1].nombre, 1);
    this.autocompletado.setValue(elemento);
    this.formulario.patchValue(elemento);
  }
  //Muestra en la pestania actualizar el elemento seleccionado de listar
  public activarActualizar(elemento) {
    this.seleccionarPestania(3, this.pestanias[2].nombre, 1);
    this.autocompletado.setValue(elemento);
    this.formulario.patchValue(elemento);

  }
  //Maneja los evento al presionar una tacla (para pestanias y opciones)
  public manejarEvento(keycode) {
    var indice = this.indiceSeleccionado;
    if (keycode == 113) {
      if (indice < this.pestanias.length) {
        this.seleccionarPestania(indice + 1, this.pestanias[indice].nombre, 0);
      } else {
        this.seleccionarPestania(1, this.pestanias[0].nombre, 0);
      }
    }
  }
  //Define el mostrado de datos y comparacion en campo select
  public compareFn = this.compararFn.bind(this);
  private compararFn(a, b) {
    if (a != null && b != null) {
      return a.id === b.id;
    }
  }
  //Formatea el valor del autocompletado
  public displayFn(elemento) {
    if (elemento != undefined) {
      return elemento.nombre ? elemento.nombre : elemento;
    } else {
      return elemento;
    }
  }
  //Formatea el valor del autocompletado
  public displayFa(elemento) {
    if (elemento != undefined) {
      return elemento.nombre ? elemento.id + ' - ' + elemento.nombre : elemento;
    } else {
      return elemento;
    }
  }
  //Verifica si se selecciono un elemento del autocompletado
  public verificarSeleccion(valor): void {
    if (typeof valor.value != 'object') {
      valor.setValue(null);
    }
  }
  //Abre el dialogo Plan de Cuenta
  public abrirPlanCuentaDialogo() {
    const dialogRef = this.dialog.open(PlanCuentaDialogo, {
      width: '90%',
      height: '90%',
      data: {
        empresa: this.formulario.get('empresa').value
      },
    });
    dialogRef.afterClosed().subscribe(resultado => {
      if(resultado) {
        this.formulario.get('cuentaContable').setValue(resultado);
      }
    });
  }
}
//Componente Plan de Cuenta
@Component({
  selector: 'plan-cuenta-dialogo',
  templateUrl: 'plan-cuenta-dialogo.component.html',
})
export class PlanCuentaDialogo {
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
  //Define el nodo seleccionado
  public nodoSeleccionado:any;
  //Constructor
  constructor(private planCuentaServicio: PlanCuentaService, private appService: AppService,
    private loaderService: LoaderService, public dialogRef: MatDialogRef<PlanCuentaDialogo>, 
    @Inject(MAT_DIALOG_DATA) public data) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
      this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<Nodo>(this.getLevel, this.isExpandable);
    this.datos = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this.planCuentaServicio.listarPorEmpresaYGrupoCuentaContable(this.data.empresa.id, 1).subscribe(res => {
      this.datos.data = res.json();
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
      nombre: new FormControl(),
      esImputable: new FormControl(),
      estaActivo: new FormControl(),
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
  //Obtiene la cuenta seleccionada
  public seleccionar(nodo): void {
    this.nodoSeleccionado = nodo;
  }
  //Cierra el dialogo
  onNoClick(): void {
    this.dialogRef.close();
  }
}