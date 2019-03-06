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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var viajePropioGasto_1 = require("src/app/modelos/viajePropioGasto");
var rubro_producto_service_1 = require("src/app/servicios/rubro-producto.service");
var fecha_service_1 = require("src/app/servicios/fecha.service");
var app_component_1 = require("src/app/app.component");
var material_1 = require("@angular/material");
var ViajeGastoComponent = /** @class */ (function () {
    //Constructor
    function ViajeGastoComponent(viajePropioGastoModelo, rubroProductoServicio, fechaServicio, appComponent, dialog) {
        this.viajePropioGastoModelo = viajePropioGastoModelo;
        this.rubroProductoServicio = rubroProductoServicio;
        this.fechaServicio = fechaServicio;
        this.appComponent = appComponent;
        this.dialog = dialog;
        //Evento que envia los datos del formulario a Viaje
        this.dataEvent = new core_1.EventEmitter();
        //Define la lista de ordenes de gastos (tabla)
        this.listaGastos = [];
        //Define la lista de resultados rubro producto de busqueda
        this.resultadosRubrosProductos = [];
        //Define si los campos son de solo lectura
        this.soloLectura = false;
        //Define si muestra el boton agregar Gasto o actualizar Gasto
        this.btnGasto = true;
    }
    //Al inicializarse el componente
    ViajeGastoComponent.prototype.ngOnInit = function () {
        var _this = this;
        //Establece el formulario viaje propio gasto
        this.formularioViajePropioGasto = this.viajePropioGastoModelo.formulario;
        //Autocompletado Rubro Producto - Buscar por nombre
        this.formularioViajePropioGasto.get('rubroProducto').valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.rubroProductoServicio.listarPorNombre(data).subscribe(function (response) {
                    _this.resultadosRubrosProductos = response;
                });
            }
        });
        //Establece los valores por defecto del formulario viaje gasto
        this.establecerValoresPorDefecto(1);
    };
    //Establece los valores por defecto del formulario viaje gasto
    ViajeGastoComponent.prototype.establecerValoresPorDefecto = function (opcion) {
        var _this = this;
        var valor = 0;
        //Establece la fecha actual
        this.fechaServicio.obtenerFecha().subscribe(function (res) {
            _this.formularioViajePropioGasto.get('fecha').setValue(res.json());
        });
        this.formularioViajePropioGasto.get('cantidad').setValue(valor);
        this.formularioViajePropioGasto.get('precioUnitario').setValue(this.appComponent.establecerCeros(valor));
        this.formularioViajePropioGasto.get('importe').setValue(this.appComponent.establecerCeros(valor));
        if (opcion == 1) {
            this.formularioViajePropioGasto.get('importeTotal').setValue(this.appComponent.establecerCeros(valor));
        }
    };
    //Agrega datos a la tabla de gastos
    ViajeGastoComponent.prototype.agregarGasto = function () {
        this.formularioViajePropioGasto.get('tipoComprobante').setValue({ id: 19 });
        var usuario = this.appComponent.getUsuario();
        this.formularioViajePropioGasto.get('sucursal').setValue(usuario.sucursal);
        this.formularioViajePropioGasto.get('usuario').setValue(usuario);
        this.listaGastos.push(this.formularioViajePropioGasto.value);
        var importe = this.formularioViajePropioGasto.get('importe').value;
        var importeTotal = this.formularioViajePropioGasto.get('importeTotal').value;
        var total = parseFloat(importeTotal) + parseFloat(importe);
        this.formularioViajePropioGasto.reset();
        this.formularioViajePropioGasto.get('importeTotal').setValue(this.appComponent.establecerCeros(total));
        this.establecerValoresPorDefecto(0);
        document.getElementById('idFechaG').focus();
        this.enviarDatos();
    };
    //Modifica los datos del Gasto
    ViajeGastoComponent.prototype.modificarGasto = function () {
        this.listaGastos[this.indiceGasto] = this.formularioViajePropioGasto.value;
        this.btnGasto = true;
        this.formularioViajePropioGasto.reset();
        this.establecerValoresPorDefecto(0);
        document.getElementById('idFechaG').focus();
        this.enviarDatos();
    };
    //Modifica un Gasto de la tabla por indice
    ViajeGastoComponent.prototype.modGasto = function (indice) {
        this.indiceGasto = indice;
        this.btnGasto = false;
        this.formularioViajePropioGasto.patchValue(this.listaGastos[indice]);
    };
    //Elimina un gasto de la tabla por indice
    ViajeGastoComponent.prototype.eliminarGasto = function (indice, elemento) {
        this.listaGastos.splice(indice, 1);
        var importe = elemento.importe;
        var importeTotal = this.formularioViajePropioGasto.get('importeTotal').value;
        var total = parseFloat(importeTotal) - parseFloat(importe);
        this.formularioViajePropioGasto.get('importeTotal').setValue(this.appComponent.establecerCeros(total));
        document.getElementById('idFechaG').focus();
        this.enviarDatos();
    };
    //Envia la lista de tramos a Viaje
    ViajeGastoComponent.prototype.enviarDatos = function () {
        this.dataEvent.emit(this.listaGastos);
    };
    //Establece la lista de efectivos
    ViajeGastoComponent.prototype.establecerLista = function (lista) {
        this.establecerValoresPorDefecto(1);
        this.listaGastos = lista;
    };
    //Establece los campos solo lectura
    ViajeGastoComponent.prototype.establecerCamposSoloLectura = function (indice) {
        switch (indice) {
            case 1:
                this.soloLectura = false;
                break;
            case 2:
                this.soloLectura = true;
                break;
            case 3:
                this.soloLectura = false;
                break;
            case 4:
                this.soloLectura = true;
                break;
        }
    };
    //Establece los ceros en los numeros flotantes
    ViajeGastoComponent.prototype.establecerCeros = function (elemento) {
        elemento.setValue(this.appComponent.establecerCeros(elemento.value));
    };
    //Establece los ceros en los numeros flotantes en tablas
    ViajeGastoComponent.prototype.establecerCerosTabla = function (elemento) {
        return this.appComponent.establecerCeros(elemento);
    };
    //Vacia la lista
    ViajeGastoComponent.prototype.vaciarListas = function () {
        this.listaGastos = [];
    };
    //Reestablece formulario y lista al cambiar de pestaña
    ViajeGastoComponent.prototype.reestablecerFormularioYLista = function () {
        this.vaciarListas();
        this.formularioViajePropioGasto.reset();
    };
    //Define como se muestra los datos en el autcompletado
    ViajeGastoComponent.prototype.displayFn = function (elemento) {
        if (elemento != undefined) {
            return elemento.nombre ? elemento.nombre : elemento;
        }
        else {
            return elemento;
        }
    };
    //Abre un dialogo para ver las observaciones
    ViajeGastoComponent.prototype.verObservacionesDialogo = function (elemento) {
        var dialogRef = this.dialog.open(ObservacionesDialogo, {
            width: '1200px',
            data: {
                tema: this.appComponent.getTema(),
                elemento: elemento
            }
        });
        dialogRef.afterClosed().subscribe(function (resultado) { });
    };
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], ViajeGastoComponent.prototype, "dataEvent", void 0);
    ViajeGastoComponent = __decorate([
        core_1.Component({
            selector: 'app-viaje-gasto',
            templateUrl: './viaje-gasto.component.html',
            styleUrls: ['./viaje-gasto.component.css']
        }),
        __metadata("design:paramtypes", [viajePropioGasto_1.ViajePropioGasto, rubro_producto_service_1.RubroProductoService,
            fecha_service_1.FechaService, app_component_1.AppComponent, material_1.MatDialog])
    ], ViajeGastoComponent);
    return ViajeGastoComponent;
}());
exports.ViajeGastoComponent = ViajeGastoComponent;
//Componente ObservacionesDialogo
var ObservacionesDialogo = /** @class */ (function () {
    //Constructor
    function ObservacionesDialogo(dialogRef, data) {
        this.dialogRef = dialogRef;
        this.data = data;
    }
    ObservacionesDialogo.prototype.ngOnInit = function () {
        //Establece el tema
        this.tema = this.data.tema;
        //Establece el formulario
        this.formulario = new forms_1.FormGroup({
            observaciones: new forms_1.FormControl()
        });
        //Establece las observaciones
        this.formulario.get('observaciones').setValue(this.data.elemento);
    };
    ObservacionesDialogo.prototype.onNoClick = function () {
        this.dialogRef.close();
    };
    ObservacionesDialogo = __decorate([
        core_1.Component({
            selector: 'observaciones-dialogo',
            templateUrl: '../observaciones-dialogo.component.html'
        }),
        __param(1, core_1.Inject(material_1.MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [material_1.MatDialogRef, Object])
    ], ObservacionesDialogo);
    return ObservacionesDialogo;
}());
exports.ObservacionesDialogo = ObservacionesDialogo;
//# sourceMappingURL=viaje-gasto.component.js.map