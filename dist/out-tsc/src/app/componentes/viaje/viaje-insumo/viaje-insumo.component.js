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
var viajePropioInsumo_1 = require("src/app/modelos/viajePropioInsumo");
var proveedor_service_1 = require("src/app/servicios/proveedor.service");
var fecha_service_1 = require("src/app/servicios/fecha.service");
var app_component_1 = require("src/app/app.component");
var insumo_producto_service_1 = require("src/app/servicios/insumo-producto.service");
var material_1 = require("@angular/material");
var ViajeInsumoComponent = /** @class */ (function () {
    //Constructor
    function ViajeInsumoComponent(viajePropioInsumoModelo, proveedorServicio, fechaServicio, appComponent, insumoProductoServicio, dialog) {
        this.viajePropioInsumoModelo = viajePropioInsumoModelo;
        this.proveedorServicio = proveedorServicio;
        this.fechaServicio = fechaServicio;
        this.appComponent = appComponent;
        this.insumoProductoServicio = insumoProductoServicio;
        this.dialog = dialog;
        //Evento que envia los datos del formulario a Viaje
        this.dataEvent = new core_1.EventEmitter();
        //Define la lista de resultados proveedores de busqueda
        this.resultadosProveedores = [];
        //Define la lista de ordenes de insumos (tabla)
        this.listaInsumos = [];
        //Define la lista de insumos productos
        this.insumos = [];
        //Define si los campos son de solo lectura
        this.soloLectura = false;
        //Define si muestra el boton agregar Insumo o actualizar Insumo
        this.btnInsumo = true;
        //Funcion para comparar y mostrar elemento de campo select
        this.compareFn = this.compararFn.bind(this);
    }
    //Al inicializarse el componente
    ViajeInsumoComponent.prototype.ngOnInit = function () {
        var _this = this;
        //Establece el formulario viaje propio insumo
        this.formularioViajePropioInsumo = this.viajePropioInsumoModelo.formulario;
        //Autocompletado Proveedor (Insumo) - Buscar por alias
        this.formularioViajePropioInsumo.get('proveedor').valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.proveedorServicio.listarPorAlias(data).subscribe(function (response) {
                    _this.resultadosProveedores = response;
                });
            }
        });
        //Obtiene la lista de insumos productos
        this.listarInsumos();
        //Establece los valores por defecto
        this.establecerValoresPorDefecto(1);
    };
    //Obtiene el listado de insumos
    ViajeInsumoComponent.prototype.listarInsumos = function () {
        var _this = this;
        this.insumoProductoServicio.listar().subscribe(function (res) {
            _this.insumos = res.json();
        }, function (err) {
            console.log(err);
        });
    };
    //Establece los valores por defecto del formulario viaje insumo
    ViajeInsumoComponent.prototype.establecerValoresPorDefecto = function (opcion) {
        var _this = this;
        var valor = 0;
        //Establece la fecha actual
        this.fechaServicio.obtenerFecha().subscribe(function (res) {
            _this.formularioViajePropioInsumo.get('fecha').setValue(res.json());
        });
        this.formularioViajePropioInsumo.get('cantidad').setValue(valor);
        this.formularioViajePropioInsumo.get('precioUnitario').setValue(this.appComponent.establecerCeros(valor));
        this.formularioViajePropioInsumo.get('importe').setValue(this.appComponent.establecerCeros(valor));
        if (opcion == 1) {
            this.formularioViajePropioInsumo.get('importeTotal').setValue(this.appComponent.establecerCeros(valor));
        }
    };
    //Establece el precio unitario
    ViajeInsumoComponent.prototype.establecerPrecioUnitario = function (formulario, elemento) {
        formulario.get('precioUnitario').setValue((formulario.get(elemento).value.precioUnitarioVenta));
        this.establecerCeros(formulario.get('precioUnitario'));
    };
    //Calcula el importe a partir de cantidad/km y precio unitario
    ViajeInsumoComponent.prototype.calcularImporte = function (formulario) {
        var cantidad = formulario.get('cantidad').value;
        var precioUnitario = formulario.get('precioUnitario').value;
        formulario.get('precioUnitario').setValue(parseFloat(precioUnitario).toFixed(2));
        if (cantidad != null && precioUnitario != null) {
            var importe = cantidad * precioUnitario;
            formulario.get('importe').setValue(importe);
            this.establecerCeros(formulario.get('importe'));
        }
    };
    //Agrega datos a la tabla de orden insumo
    ViajeInsumoComponent.prototype.agregarInsumo = function () {
        this.formularioViajePropioInsumo.get('tipoComprobante').setValue({ id: 18 });
        this.formularioViajePropioInsumo.get('sucursal').setValue(this.appComponent.getUsuario().sucursal);
        this.formularioViajePropioInsumo.get('usuario').setValue(this.appComponent.getUsuario());
        this.listaInsumos.push(this.formularioViajePropioInsumo.value);
        this.formularioViajePropioInsumo.reset();
        this.calcularImporteTotal();
        this.establecerValoresPorDefecto(0);
        document.getElementById('idProveedor').focus();
        this.enviarDatos();
    };
    //Modifica los datos del Insumo
    ViajeInsumoComponent.prototype.modificarInsumo = function () {
        this.listaInsumos[this.indiceInsumo] = this.formularioViajePropioInsumo.value;
        this.btnInsumo = true;
        this.formularioViajePropioInsumo.reset();
        this.calcularImporteTotal();
        this.establecerValoresPorDefecto(0);
        document.getElementById('idProveedor').focus();
        this.enviarDatos();
    };
    //Modifica un Insumo de la tabla por indice
    ViajeInsumoComponent.prototype.modInsumo = function (indice) {
        this.indiceInsumo = indice;
        this.btnInsumo = false;
        this.formularioViajePropioInsumo.patchValue(this.listaInsumos[indice]);
    };
    //Elimina una orden insumo de la tabla por indice
    ViajeInsumoComponent.prototype.eliminarInsumo = function (indice, elemento) {
        this.listaInsumos[indice].id = elemento.id * (-1);
        this.calcularImporteTotal();
        document.getElementById('idProveedor').focus();
        this.enviarDatos();
    };
    //Calcula el importe total
    ViajeInsumoComponent.prototype.calcularImporteTotal = function () {
        var total = 0;
        this.listaInsumos.forEach(function (item) {
            if (item.id != -1) {
                total += item.importe;
            }
        });
        this.formularioViajePropioInsumo.get('importeTotal').setValue(this.appComponent.establecerCeros(total));
    };
    //Envia la lista de tramos a Viaje
    ViajeInsumoComponent.prototype.enviarDatos = function () {
        this.dataEvent.emit(this.listaInsumos);
    };
    //Establece la lista de efectivos
    ViajeInsumoComponent.prototype.establecerLista = function (lista) {
        this.establecerValoresPorDefecto(1);
        this.listaInsumos = lista;
        this.calcularImporteTotal();
    };
    //Establece los campos solo lectura
    ViajeInsumoComponent.prototype.establecerCamposSoloLectura = function (indice) {
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
    ViajeInsumoComponent.prototype.establecerCamposSelectSoloLectura = function (opcion) {
        if (opcion) {
            this.formularioViajePropioInsumo.get('insumoProducto').disable();
        }
        else {
            this.formularioViajePropioInsumo.get('insumoProducto').enable();
        }
    };
    //Establece los ceros en los numeros flotantes
    ViajeInsumoComponent.prototype.establecerCeros = function (elemento) {
        elemento.setValue(this.appComponent.establecerCeros(elemento.value));
    };
    //Establece los ceros en los numeros flotantes en tablas
    ViajeInsumoComponent.prototype.establecerCerosTabla = function (elemento) {
        return this.appComponent.establecerCeros(elemento);
    };
    //Vacia la lista
    ViajeInsumoComponent.prototype.vaciarListas = function () {
        this.listaInsumos = [];
    };
    //Reestablece formulario y lista al cambiar de pestaña
    ViajeInsumoComponent.prototype.reestablecerFormularioYLista = function () {
        this.vaciarListas();
        this.formularioViajePropioInsumo.reset();
    };
    //Define como se muestra los datos en el autcompletado
    ViajeInsumoComponent.prototype.displayFn = function (elemento) {
        if (elemento != undefined) {
            return elemento.alias ? elemento.alias : elemento;
        }
        else {
            return elemento;
        }
    };
    ViajeInsumoComponent.prototype.compararFn = function (a, b) {
        if (a != null && b != null) {
            return a.id === b.id;
        }
    };
    //Abre un dialogo para ver las observaciones
    ViajeInsumoComponent.prototype.verObservacionesDialogo = function (elemento) {
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
    ], ViajeInsumoComponent.prototype, "dataEvent", void 0);
    ViajeInsumoComponent = __decorate([
        core_1.Component({
            selector: 'app-viaje-insumo',
            templateUrl: './viaje-insumo.component.html',
            styleUrls: ['./viaje-insumo.component.css']
        }),
        __metadata("design:paramtypes", [viajePropioInsumo_1.ViajePropioInsumo, proveedor_service_1.ProveedorService,
            fecha_service_1.FechaService, app_component_1.AppComponent,
            insumo_producto_service_1.InsumoProductoService, material_1.MatDialog])
    ], ViajeInsumoComponent);
    return ViajeInsumoComponent;
}());
exports.ViajeInsumoComponent = ViajeInsumoComponent;
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
//# sourceMappingURL=viaje-insumo.component.js.map