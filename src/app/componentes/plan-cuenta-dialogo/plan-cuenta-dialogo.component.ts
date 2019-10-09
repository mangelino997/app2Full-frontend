import { Component, Inject } from "@angular/core";
import { Nodo, Arbol } from "../plan-cuenta/plan-cuenta.component";
import { FlatTreeControl } from "@angular/cdk/tree";
import { MatTreeFlattener, MatTreeFlatDataSource, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormGroup, FormControl } from "@angular/forms";
import { Subscription } from "rxjs";
import { PlanCuentaService } from "src/app/servicios/plan-cuenta.service";
import { LoaderService } from "src/app/servicios/loader.service";
import { LoaderState } from "src/app/modelos/loader";

//Componente Plan de Cuenta
@Component({
    selector: 'plan-cuenta-dialogo',
    templateUrl: 'plan-cuenta-dialogo.component.html',
    styleUrls: ['plan-cuenta-dialogo.component.css']
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
    public nodoSeleccionado: any;
    //Define el id del ultimo nodo seleccionado
    public ultimoNodoSeleccionado: number = 0;
    //Constructor
    constructor(private planCuentaServicio: PlanCuentaService, private loaderService: LoaderService,
        public dialogRef: MatDialogRef<PlanCuentaDialogo>,
        @Inject(MAT_DIALOG_DATA) public data) {
        this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
            this.isExpandable, this.getChildren);
        this.treeControl = new FlatTreeControl<Nodo>(this.getLevel, this.isExpandable);
        this.datos = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
        this.planCuentaServicio.obtenerPorEmpresaYGrupoCuentaContable(this.data.empresa.id, this.data.grupoCuentaContable).subscribe(res => {
            let data = [];
            data.push(res.json());
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
        let row = "idFilaSeleccionada" + nodo.id;
        let btn = "idBotonSeleccionado" + nodo.id;
        document.getElementById(row).classList.add('pintar-fila');
        document.getElementById(btn).setAttribute("disabled", "disabled");
        let ultimaFilaSeleccionada = "idFilaSeleccionada" + this.ultimoNodoSeleccionado;
        let ultimBtnSeleccionado = "idBotonSeleccionado" + this.ultimoNodoSeleccionado;
        try {
            document.getElementById(ultimaFilaSeleccionada).classList.remove('pintar-fila');
            document.getElementById(ultimBtnSeleccionado).removeAttribute("disabled");
        } catch (e) { }
        setTimeout(() => {
            this.ultimoNodoSeleccionado = nodo.id;
        }, 20);
    }
    //Cierra el dialogo
    onNoClick(): void {
        this.dialogRef.close();
    }
}