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
var subopcion_pestania_service_1 = require("../../servicios/subopcion-pestania.service");
var forms_1 = require("@angular/forms");
var ngx_toastr_1 = require("ngx-toastr");
var PuntosVentaAutorizadoComponent = /** @class */ (function () {
    // public compereFn:any;
    //Constructor
    function PuntosVentaAutorizadoComponent(subopcionPestaniaService, toastr) {
        this.subopcionPestaniaService = subopcionPestaniaService;
        this.toastr = toastr;
        //Define la pestania activa
        this.activeLink = null;
        //Define el indice seleccionado de pestania
        this.indiceSeleccionado = null;
        //Define la pestania actual seleccionada
        this.pestaniaActual = null;
        //Define si mostrar el autocompletado
        this.mostrarAutocompletado = null;
        //Define si el campo es de solo lectura
        this.soloLectura = false;
        //Define si mostrar el boton
        this.mostrarBoton = null;
        //Define la lista de pestanias
        this.pestanias = [];
        //Define la lista completa de registros
        this.listaCompleta = [];
        //Define el autocompletado
        this.autocompletado = new forms_1.FormControl();
        //Define empresa para las busquedas
        this.empresaBusqueda = new forms_1.FormControl();
        //Define la lista de resultados de busqueda
        this.resultados = [];
        //Define la lista de resultados de busqueda companias seguros
        this.resultadosCompaniasSeguros = [];
        //Defien la lista de empresas
        this.empresas = [];
    }
    PuntosVentaAutorizadoComponent.prototype.ngOnInit = function () {
        //Define el formulario y validaciones
        this.formulario = new forms_1.FormGroup({
            id: new forms_1.FormControl(),
            version: new forms_1.FormControl(),
            empresa: new forms_1.FormControl()
        });
    };
    //Reestablece los campos formularios
    PuntosVentaAutorizadoComponent.prototype.reestablecerFormulario = function (id) {
        this.formulario.reset();
        this.formulario.get('id').setValue(id);
        this.autocompletado.setValue(undefined);
        this.resultados = [];
    };
    //Manejo de colores de campos y labels
    PuntosVentaAutorizadoComponent.prototype.cambioCampo = function (id, label) {
        document.getElementById(id).classList.remove('is-invalid');
        document.getElementById(label).classList.remove('label-error');
    };
    ;
    PuntosVentaAutorizadoComponent = __decorate([
        core_1.Component({
            selector: 'app-puntos-venta-autorizado',
            templateUrl: './puntos-venta-autorizado.component.html',
            styleUrls: ['./puntos-venta-autorizado.component.css']
        }),
        __metadata("design:paramtypes", [subopcion_pestania_service_1.SubopcionPestaniaService, ngx_toastr_1.ToastrService])
    ], PuntosVentaAutorizadoComponent);
    return PuntosVentaAutorizadoComponent;
}());
exports.PuntosVentaAutorizadoComponent = PuntosVentaAutorizadoComponent;
//# sourceMappingURL=puntos-venta-autorizado.component.js.map