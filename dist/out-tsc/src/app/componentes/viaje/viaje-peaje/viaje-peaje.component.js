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
var viajePropioPeaje_1 = require("src/app/modelos/viajePropioPeaje");
var proveedor_service_1 = require("src/app/servicios/proveedor.service");
var fecha_service_1 = require("src/app/servicios/fecha.service");
var app_component_1 = require("src/app/app.component");
var ViajePeajeComponent = /** @class */ (function () {
    //Constructor
    function ViajePeajeComponent(viajePropioPeajeModelo, proveedorServicio, fechaServicio, appComponent) {
        this.viajePropioPeajeModelo = viajePropioPeajeModelo;
        this.proveedorServicio = proveedorServicio;
        this.fechaServicio = fechaServicio;
        this.appComponent = appComponent;
        //Evento que envia los datos del formulario a Viaje
        this.dataEvent = new core_1.EventEmitter();
        //Define la lista de ordenes de peajes (tabla)
        this.listaPeajes = [];
        //Define la lista de proveedores
        this.resultadosProveedores = [];
        //Define si los campos son de solo lectura
        this.soloLectura = false;
        //Define si muestra el boton agregar Peaje o actualizar Peaje
        this.btnPeaje = true;
    }
    //Al inicializarse el componente
    ViajePeajeComponent.prototype.ngOnInit = function () {
        var _this = this;
        //Establece el formulario viaje propio peaje
        this.formularioViajePropioPeaje = this.viajePropioPeajeModelo.formulario;
        //Autocompletado Proveedor (Peaje) - Buscar por alias
        this.formularioViajePropioPeaje.get('proveedor').valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.proveedorServicio.listarPorAlias(data).subscribe(function (response) {
                    _this.resultadosProveedores = response;
                });
            }
        });
        //Establece los valores por defecto del formulario viaje peaje
        this.establecerValoresPorDefecto(1);
    };
    //Establece los valores por defecto del formulario viaje gasto
    ViajePeajeComponent.prototype.establecerValoresPorDefecto = function (opcion) {
        var _this = this;
        var valor = 0;
        //Establece la fecha actual
        this.fechaServicio.obtenerFecha().subscribe(function (res) {
            _this.formularioViajePropioPeaje.get('fecha').setValue(res.json());
        });
        this.formularioViajePropioPeaje.get('importe').setValue(this.appComponent.establecerCeros(valor));
        if (opcion == 1) {
            this.formularioViajePropioPeaje.get('importeTotal').setValue(this.appComponent.establecerCeros(valor));
        }
    };
    //Agrega datos a la tabla de peajes
    ViajePeajeComponent.prototype.agregarPeaje = function () {
        this.formularioViajePropioPeaje.get('tipoComprobante').setValue({ id: 17 });
        this.formularioViajePropioPeaje.get('usuario').setValue(this.appComponent.getUsuario());
        this.listaPeajes.push(this.formularioViajePropioPeaje.value);
        var importe = this.formularioViajePropioPeaje.get('importe').value;
        var importeTotal = this.formularioViajePropioPeaje.get('importeTotal').value;
        var total = parseFloat(importeTotal) + parseFloat(importe);
        this.formularioViajePropioPeaje.reset();
        this.formularioViajePropioPeaje.get('importeTotal').setValue(this.appComponent.establecerCeros(total));
        this.establecerValoresPorDefecto(0);
        document.getElementById('idProveedorP').focus();
        this.enviarDatos();
    };
    //Modifica los datos del Peaje
    ViajePeajeComponent.prototype.modificarPeaje = function () {
        this.listaPeajes[this.indicePeaje] = this.formularioViajePropioPeaje.value;
        this.btnPeaje = true;
        this.formularioViajePropioPeaje.reset();
        this.establecerValoresPorDefecto(0);
        document.getElementById('idProveedorP').focus();
        this.enviarDatos();
    };
    //Modifica un Peaje de la tabla por indice
    ViajePeajeComponent.prototype.modPeaje = function (indice) {
        this.indicePeaje = indice;
        this.btnPeaje = false;
        this.formularioViajePropioPeaje.patchValue(this.listaPeajes[indice]);
    };
    //Elimina un peaje de la tabla por indice
    ViajePeajeComponent.prototype.eliminarPeaje = function (indice, elemento) {
        this.listaPeajes.splice(indice, 1);
        var importe = elemento.importe;
        var importeTotal = this.formularioViajePropioPeaje.get('importeTotal').value;
        var total = parseFloat(importeTotal) - parseFloat(importe);
        this.formularioViajePropioPeaje.get('importeTotal').setValue(this.appComponent.establecerCeros(total));
        document.getElementById('idProveedorP').focus();
        this.enviarDatos();
    };
    //Establece la cantidad de ceros correspondientes a la izquierda del numero
    ViajePeajeComponent.prototype.establecerCerosIzq = function (elemento, string, cantidad) {
        elemento.setValue((string + elemento.value).slice(cantidad));
    };
    //Define como se muestran los ceros a la izquierda en tablas
    ViajePeajeComponent.prototype.mostrarCeros = function (elemento, string, cantidad) {
        return elemento ? (string + elemento).slice(cantidad) : elemento;
    };
    //Envia la lista de tramos a Viaje
    ViajePeajeComponent.prototype.enviarDatos = function () {
        this.dataEvent.emit(this.listaPeajes);
    };
    //Establece la lista de efectivos
    ViajePeajeComponent.prototype.establecerLista = function (lista) {
        this.establecerValoresPorDefecto(1);
        this.listaPeajes = lista;
    };
    //Establece los campos solo lectura
    ViajePeajeComponent.prototype.establecerCamposSoloLectura = function (indice) {
        switch (indice) {
            case 1:
                this.soloLectura = false;
                // this.establecerCamposSelectSoloLectura(false);
                break;
            case 2:
                this.soloLectura = true;
                // this.establecerCamposSelectSoloLectura(true);
                break;
            case 3:
                this.soloLectura = false;
                // this.establecerCamposSelectSoloLectura(false);
                break;
            case 4:
                this.soloLectura = true;
                // this.establecerCamposSelectSoloLectura(true);
                break;
        }
    };
    //Establece los ceros en los numeros flotantes
    ViajePeajeComponent.prototype.establecerCeros = function (elemento) {
        elemento.setValue(this.appComponent.establecerCeros(elemento.value));
    };
    //Establece los ceros en los numeros flotantes en tablas
    ViajePeajeComponent.prototype.establecerCerosTabla = function (elemento) {
        return this.appComponent.establecerCeros(elemento);
    };
    //Vacia la lista
    ViajePeajeComponent.prototype.vaciarListas = function () {
        this.listaPeajes = [];
    };
    //Reestablece formulario y lista al cambiar de pestaña
    ViajePeajeComponent.prototype.reestablecerFormularioYLista = function () {
        this.vaciarListas();
        this.formularioViajePropioPeaje.reset();
    };
    //Define como se muestra los datos en el autcompletado
    ViajePeajeComponent.prototype.displayFn = function (elemento) {
        if (elemento != undefined) {
            return elemento.alias ? elemento.alias : elemento;
        }
        else {
            return elemento;
        }
    };
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], ViajePeajeComponent.prototype, "dataEvent", void 0);
    ViajePeajeComponent = __decorate([
        core_1.Component({
            selector: 'app-viaje-peaje',
            templateUrl: './viaje-peaje.component.html',
            styleUrls: ['./viaje-peaje.component.css']
        }),
        __metadata("design:paramtypes", [viajePropioPeaje_1.ViajePropioPeaje, proveedor_service_1.ProveedorService,
            fecha_service_1.FechaService, app_component_1.AppComponent])
    ], ViajePeajeComponent);
    return ViajePeajeComponent;
}());
exports.ViajePeajeComponent = ViajePeajeComponent;
//# sourceMappingURL=viaje-peaje.component.js.map