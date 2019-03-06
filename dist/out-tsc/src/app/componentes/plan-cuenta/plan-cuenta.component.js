"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var tree_1 = require("@angular/cdk/tree");
var tree_2 = require("@angular/material/tree");
var plan_cuenta_service_1 = require("src/app/servicios/plan-cuenta.service");
var app_component_1 = require("src/app/app.component");
var Arbol = /** @class */ (function () {
    function Arbol() {
    }
    return Arbol;
}());
exports.Arbol = Arbol;
var Nodo = /** @class */ (function () {
    function Nodo() {
    }
    return Nodo;
}());
exports.Nodo = Nodo;
var PlanCuentaComponent = /** @class */ (function () {
    //Constructor
    function PlanCuentaComponent(planCuentaServicio, appComponent) {
        var _this = this;
        this.planCuentaServicio = planCuentaServicio;
        this.appComponent = appComponent;
        this.flatNodeMap = new Map();
        this.nestedNodeMap = new Map();
        this.selectedParent = null;
        this.newItemName = '';
        this.getLevel = function (node) { return node.level; };
        this.isExpandable = function (node) { return node.expandable; };
        this.getChildren = function (node) { return node.hijos; };
        this.hasChild = function (_, _nodeData) { return _nodeData.expandable; };
        this.hasNoContent = function (_, _nodeData) { return _nodeData.nombre === ''; };
        this.transformer = function (node, level) {
            var existingNode = _this.nestedNodeMap.get(node);
            var flatNode = existingNode && existingNode.nombre === node.nombre
                ? existingNode
                : new Nodo();
            flatNode.id = node.id;
            flatNode.nombre = node.nombre;
            flatNode.level = level;
            flatNode.esImputable = node.esImputable;
            flatNode.estaActivo = node.estaActivo;
            flatNode.empresa = {};
            flatNode.usuarioAlta = {};
            flatNode.hijos = node.hijos;
            flatNode.expandable = !!node.hijos;
            _this.flatNodeMap.set(flatNode, node);
            _this.nestedNodeMap.set(node, flatNode);
            return flatNode;
        };
        this.treeFlattener = new tree_2.MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
        this.treeControl = new tree_1.FlatTreeControl(this.getLevel, this.isExpandable);
        this.datos = new tree_2.MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
        this.planCuentaServicio.listaCompleta.subscribe(function (data) {
            _this.datos.data = data;
        });
    }
    //Obtiene el nodo padre de un nodo
    PlanCuentaComponent.prototype.obtenerNodoPadre = function (node) {
        var currentLevel = this.getLevel(node);
        if (currentLevel < 1) {
            return null;
        }
        var startIndex = this.treeControl.dataNodes.indexOf(node) - 1;
        for (var i = startIndex; i >= 0; i--) {
            var currentNode = this.treeControl.dataNodes[i];
            if (this.getLevel(currentNode) < currentLevel) {
                return currentNode;
            }
        }
        return null;
    };
    //Crea un nuevo nodo
    PlanCuentaComponent.prototype.nuevoNodo = function (nodo) {
        var nodoPadre = this.flatNodeMap.get(nodo);
        this.planCuentaServicio.agregarElemento(nodoPadre, '');
        this.treeControl.expand(nodo);
    };
    //Agrega el nodo
    PlanCuentaComponent.prototype.agregar = function (nodo, nombre, imputable, activo) {
        var elemento = this.flatNodeMap.get(nodo);
        elemento.nombre = nombre;
        elemento.esImputable = imputable;
        elemento.estaActivo = activo;
        elemento.hijos = [];
        elemento.empresa = this.appComponent.getEmpresa();
        elemento.usuarioAlta = this.appComponent.getUsuario();
        this.planCuentaServicio.agregar(elemento);
    };
    //Elimina el nodo
    PlanCuentaComponent.prototype.eliminar = function (nodo) {
        var aNodo = this.flatNodeMap.get(nodo);
        var pNodo = this.obtenerNodoPadre(nodo);
        this.planCuentaServicio.eliminar(aNodo.id, pNodo);
    };
    PlanCuentaComponent = __decorate([
        core_1.Component({
            selector: 'app-plan-cuenta',
            templateUrl: './plan-cuenta.component.html',
            styleUrls: ['./plan-cuenta.component.css']
        }),
        __metadata("design:paramtypes", [plan_cuenta_service_1.PlanCuentaService, app_component_1.AppComponent])
    ], PlanCuentaComponent);
    return PlanCuentaComponent;
}());
exports.PlanCuentaComponent = PlanCuentaComponent;
//# sourceMappingURL=plan-cuenta.component.js.map