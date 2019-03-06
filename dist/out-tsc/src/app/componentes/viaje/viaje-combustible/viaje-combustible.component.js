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
var proveedor_service_1 = require("src/app/servicios/proveedor.service");
var viajePropioCombustible_1 = require("src/app/modelos/viajePropioCombustible");
var fecha_service_1 = require("src/app/servicios/fecha.service");
var app_component_1 = require("src/app/app.component");
var insumo_producto_service_1 = require("src/app/servicios/insumo-producto.service");
var material_1 = require("@angular/material");
var ViajeCombustibleComponent = /** @class */ (function () {
    //Constructor
    function ViajeCombustibleComponent(proveedorServicio, viajePropioCombustibleModelo, fechaServicio, appComponent, insumoProductoServicio, dialog) {
        this.proveedorServicio = proveedorServicio;
        this.viajePropioCombustibleModelo = viajePropioCombustibleModelo;
        this.fechaServicio = fechaServicio;
        this.appComponent = appComponent;
        this.insumoProductoServicio = insumoProductoServicio;
        this.dialog = dialog;
        //Evento que envia los datos del formulario a Viaje
        this.dataEvent = new core_1.EventEmitter();
        //Define la lista de resultados proveedores de busqueda
        this.resultadosProveedores = [];
        //Define la lista de insumos
        this.insumos = [];
        //Define la lista de combustibles
        this.listaCombustibles = [];
        //Define si los campos son de solo lectura
        this.soloLectura = false;
        //Define si muestra el boton agregar combustible o actualizar combustible
        this.btnCombustible = true;
        //Funcion para comparar y mostrar elemento de campo select
        this.compareFn = this.compararFn.bind(this);
    }
    //Al inicilizarse el componente
    ViajeCombustibleComponent.prototype.ngOnInit = function () {
        var _this = this;
        //Establece el formulario viaje propio combustible
        this.formularioViajePropioCombustible = this.viajePropioCombustibleModelo.formulario;
        //Autocompletado Proveedor (Combustible) - Buscar por alias
        this.formularioViajePropioCombustible.get('proveedor').valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.proveedorServicio.listarPorAlias(data).subscribe(function (response) {
                    _this.resultadosProveedores = response;
                });
            }
        });
        //Obtiene la lista de insumos
        this.listarInsumos();
        //Establece los valores por defecto del formulario viaje combustible
        this.establecerValoresPorDefecto(1);
    };
    //Establece los valores por defecto del formulario viaje combustible
    ViajeCombustibleComponent.prototype.establecerValoresPorDefecto = function (opcion) {
        var _this = this;
        var valor = 0;
        //Establece la fecha actual
        this.fechaServicio.obtenerFecha().subscribe(function (res) {
            _this.formularioViajePropioCombustible.get('fecha').setValue(res.json());
        });
        this.formularioViajePropioCombustible.get('cantidad').setValue(valor);
        this.formularioViajePropioCombustible.get('precioUnitario').setValue(this.appComponent.establecerCeros(valor));
        this.formularioViajePropioCombustible.get('importe').setValue(this.appComponent.establecerCeros(valor));
        if (opcion == 1) {
            this.formularioViajePropioCombustible.get('totalCombustible').setValue(this.appComponent.establecerCeros(valor));
            this.formularioViajePropioCombustible.get('totalUrea').setValue(this.appComponent.establecerCeros(valor));
        }
    };
    //Obtiene el listado de insumos
    ViajeCombustibleComponent.prototype.listarInsumos = function () {
        var _this = this;
        this.insumoProductoServicio.listar().subscribe(function (res) {
            _this.insumos = res.json();
        }, function (err) {
            console.log(err);
        });
    };
    //Calcula el importe a partir de cantidad/km y precio unitario
    ViajeCombustibleComponent.prototype.calcularImporte = function (formulario) {
        var cantidad = formulario.get('cantidad').value;
        var precioUnitario = formulario.get('precioUnitario').value;
        formulario.get('precioUnitario').setValue(parseFloat(precioUnitario).toFixed(2));
        if (cantidad != null && precioUnitario != null) {
            var importe = cantidad * precioUnitario;
            formulario.get('importe').setValue(importe);
            this.establecerCeros(formulario.get('importe'));
        }
    };
    //Establece el precio unitario
    ViajeCombustibleComponent.prototype.establecerPrecioUnitario = function (formulario, elemento) {
        formulario.get('precioUnitario').setValue((formulario.get(elemento).value.precioUnitarioVenta));
        this.establecerCeros(formulario.get('precioUnitario'));
    };
    //Agrega datos a la tabla de combustibles
    ViajeCombustibleComponent.prototype.agregarCombustible = function () {
        this.formularioViajePropioCombustible.get('tipoComprobante').setValue({ id: 15 });
        this.formularioViajePropioCombustible.get('sucursal').setValue(this.appComponent.getUsuario().sucursal);
        this.formularioViajePropioCombustible.get('usuario').setValue(this.appComponent.getUsuario());
        this.listaCombustibles.push(this.formularioViajePropioCombustible.value);
        this.formularioViajePropioCombustible.reset();
        this.calcularTotalCombustibleYUrea();
        this.establecerValoresPorDefecto(0);
        document.getElementById('idProveedorOC').focus();
        this.enviarDatos();
    };
    //Modifica los datos del combustible
    ViajeCombustibleComponent.prototype.modificarCombustible = function () {
        this.listaCombustibles[this.indiceCombustible] = this.formularioViajePropioCombustible.value;
        this.btnCombustible = true;
        this.formularioViajePropioCombustible.reset();
        this.calcularTotalCombustibleYUrea();
        this.establecerValoresPorDefecto(0);
        document.getElementById('idProveedorOC').focus();
        this.enviarDatos();
    };
    //Modifica un combustible de la tabla por indice
    ViajeCombustibleComponent.prototype.modCombustible = function (indice) {
        this.indiceCombustible = indice;
        this.btnCombustible = false;
        this.formularioViajePropioCombustible.patchValue(this.listaCombustibles[indice]);
    };
    //Elimina un combustible de la tabla por indice
    ViajeCombustibleComponent.prototype.eliminarCombustible = function (indice, elemento) {
        this.listaCombustibles[indice].id = elemento.id * (-1);
        this.calcularTotalCombustibleYUrea();
        document.getElementById('idProveedorOC').focus();
        this.enviarDatos();
    };
    //Calcula el total de combustible y el total de urea
    ViajeCombustibleComponent.prototype.calcularTotalCombustibleYUrea = function () {
        var totalCombustible = 0;
        var totalUrea = 0;
        this.listaCombustibles.forEach(function (item) {
            if (item.id != -1) {
                if (item.insumo.id == 1) {
                    totalCombustible += item.cantidad;
                }
                else if (item.insumo.id == 3) {
                    totalUrea += item.cantidad;
                }
            }
        });
        this.formularioViajePropioCombustible.get('totalCombustible').setValue(totalCombustible.toFixed(2));
        this.formularioViajePropioCombustible.get('totalUrea').setValue(totalUrea.toFixed(2));
    };
    //Establece los ceros en los numeros flotantes
    ViajeCombustibleComponent.prototype.establecerCeros = function (elemento) {
        elemento.setValue(this.appComponent.establecerCeros(elemento.value));
    };
    //Establece los ceros en los numeros flotantes en tablas
    ViajeCombustibleComponent.prototype.establecerCerosTabla = function (elemento) {
        return this.appComponent.establecerCeros(elemento);
    };
    //Envia la lista de tramos a Viaje
    ViajeCombustibleComponent.prototype.enviarDatos = function () {
        this.dataEvent.emit(this.listaCombustibles);
    };
    //Establece la lista de combustibles
    ViajeCombustibleComponent.prototype.establecerLista = function (lista) {
        this.establecerValoresPorDefecto(1);
        this.listaCombustibles = lista;
        this.calcularTotalCombustibleYUrea();
    };
    //Establece los campos solo lectura
    ViajeCombustibleComponent.prototype.establecerCamposSoloLectura = function (indice) {
        switch (indice) {
            case 1:
                this.soloLectura = false;
                this.establecerCamposSelectSoloLectura(false);
                break;
            case 2:
                this.soloLectura = true;
                this.establecerCamposSelectSoloLectura(true);
                break;
            case 3:
                this.soloLectura = false;
                this.establecerCamposSelectSoloLectura(false);
                break;
            case 4:
                this.soloLectura = true;
                this.establecerCamposSelectSoloLectura(true);
                break;
        }
    };
    //Establece los campos select en solo lectura o no
    ViajeCombustibleComponent.prototype.establecerCamposSelectSoloLectura = function (opcion) {
        if (opcion) {
            this.formularioViajePropioCombustible.get('insumo').disable();
        }
        else {
            this.formularioViajePropioCombustible.get('insumo').enable();
        }
    };
    //Vacia la lista
    ViajeCombustibleComponent.prototype.vaciarListas = function () {
        this.listaCombustibles = [];
    };
    //Reestablece formulario y lista al cambiar de pestaña
    ViajeCombustibleComponent.prototype.reestablecerFormularioYLista = function () {
        this.vaciarListas();
        this.formularioViajePropioCombustible.reset();
    };
    ViajeCombustibleComponent.prototype.compararFn = function (a, b) {
        if (a != null && b != null) {
            return a.id === b.id;
        }
    };
    //Define como se muestra los datos en el autcompletado c
    ViajeCombustibleComponent.prototype.displayFn = function (elemento) {
        if (elemento != undefined) {
            return elemento.alias ? elemento.alias : elemento;
        }
        else {
            return elemento;
        }
    };
    //Abre un dialogo para ver las observaciones
    ViajeCombustibleComponent.prototype.verObservacionesDialogo = function (elemento) {
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
    ], ViajeCombustibleComponent.prototype, "dataEvent", void 0);
    ViajeCombustibleComponent = __decorate([
        core_1.Component({
            selector: 'app-viaje-combustible',
            templateUrl: './viaje-combustible.component.html',
            styleUrls: ['./viaje-combustible.component.css']
        }),
        __metadata("design:paramtypes", [proveedor_service_1.ProveedorService, viajePropioCombustible_1.ViajePropioCombustible,
            fecha_service_1.FechaService, app_component_1.AppComponent,
            insumo_producto_service_1.InsumoProductoService, material_1.MatDialog])
    ], ViajeCombustibleComponent);
    return ViajeCombustibleComponent;
}());
exports.ViajeCombustibleComponent = ViajeCombustibleComponent;
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
//# sourceMappingURL=viaje-combustible.component.js.map