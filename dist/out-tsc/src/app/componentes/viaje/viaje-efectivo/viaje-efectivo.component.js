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
var empresa_service_1 = require("src/app/servicios/empresa.service");
var viajePropioEfectivo_1 = require("src/app/modelos/viajePropioEfectivo");
var fecha_service_1 = require("src/app/servicios/fecha.service");
var app_component_1 = require("src/app/app.component");
var material_1 = require("@angular/material");
var ViajeEfectivoComponent = /** @class */ (function () {
    //Constructor
    function ViajeEfectivoComponent(viajePropioEfectivoModelo, empresaServicio, fechaServicio, appComponent, dialog) {
        this.viajePropioEfectivoModelo = viajePropioEfectivoModelo;
        this.empresaServicio = empresaServicio;
        this.fechaServicio = fechaServicio;
        this.appComponent = appComponent;
        this.dialog = dialog;
        //Evento que envia los datos del formulario a Viaje
        this.dataEvent = new core_1.EventEmitter();
        //Define la lista de adelantos de efectivo (tabla)
        this.listaEfectivos = [];
        //Define la lista de empresas
        this.empresas = [];
        //Define si los campos son de solo lectura
        this.soloLectura = false;
        //Define si muestra el boton agregar efectivo o actualizar efectivo
        this.btnEfectivo = true;
        //Funcion para comparar y mostrar elemento de campo select
        this.compareFn = this.compararFn.bind(this);
    }
    //Al inicializarse el componente
    ViajeEfectivoComponent.prototype.ngOnInit = function () {
        //Establece el formulario viaje propio efectivo
        this.formularioViajePropioEfectivo = this.viajePropioEfectivoModelo.formulario;
        //Obtiene la lista de empresas
        this.listarEmpresas();
        //Establece los valores por defecto del formulario viaje efectivo
        this.establecerValoresPorDefecto(1);
    };
    //Obtiene el listado de empresas
    ViajeEfectivoComponent.prototype.listarEmpresas = function () {
        var _this = this;
        this.empresaServicio.listar().subscribe(function (res) {
            _this.empresas = res.json();
        }, function (err) {
            console.log(err);
        });
    };
    //Establece los valores por defecto del formulario viaje adelanto efectivo
    ViajeEfectivoComponent.prototype.establecerValoresPorDefecto = function (opcion) {
        var _this = this;
        var valor = 0;
        //Establece la fecha actual
        this.fechaServicio.obtenerFecha().subscribe(function (res) {
            _this.fechaActual = res.json();
            _this.formularioViajePropioEfectivo.get('fechaCaja').setValue(res.json());
        });
        this.formularioViajePropioEfectivo.get('importe').setValue(this.appComponent.establecerCeros(valor));
        if (opcion == 1) {
            this.formularioViajePropioEfectivo.get('importeTotal').setValue(this.appComponent.establecerCeros(valor));
        }
    };
    //Agrega datos a la tabla de adelanto efectivo
    ViajeEfectivoComponent.prototype.agregarEfectivo = function () {
        this.formularioViajePropioEfectivo.get('fecha').setValue(this.fechaActual);
        this.formularioViajePropioEfectivo.get('tipoComprobante').setValue({ id: 16 });
        this.formularioViajePropioEfectivo.get('sucursal').setValue(this.appComponent.getUsuario().sucursal);
        this.formularioViajePropioEfectivo.get('usuario').setValue(this.appComponent.getUsuario());
        this.listaEfectivos.push(this.formularioViajePropioEfectivo.value);
        this.formularioViajePropioEfectivo.reset();
        this.calcularImporteTotal();
        this.establecerValoresPorDefecto(0);
        document.getElementById('idFechaCajaAE').focus();
        this.enviarDatos();
    };
    //Modifica los datos del Efectivo
    ViajeEfectivoComponent.prototype.modificarEfectivo = function () {
        this.listaEfectivos[this.indiceEfectivo] = this.formularioViajePropioEfectivo.value;
        this.btnEfectivo = true;
        this.formularioViajePropioEfectivo.reset();
        this.calcularImporteTotal();
        this.establecerValoresPorDefecto(0);
        document.getElementById('idFechaCajaAE').focus();
        this.enviarDatos();
    };
    //Modifica un Efectivo de la tabla por indice
    ViajeEfectivoComponent.prototype.modEfectivo = function (indice) {
        this.indiceEfectivo = indice;
        this.btnEfectivo = false;
        this.formularioViajePropioEfectivo.patchValue(this.listaEfectivos[indice]);
    };
    //Elimina un  efectivo de la tabla por indice
    ViajeEfectivoComponent.prototype.eliminarEfectivo = function (indice, elemento) {
        this.listaEfectivos[indice].id = elemento.id * (-1);
        this.calcularImporteTotal();
        document.getElementById('idFechaCajaAE').focus();
        this.enviarDatos();
    };
    //Calcula el importe total
    ViajeEfectivoComponent.prototype.calcularImporteTotal = function () {
        var total = 0;
        this.listaEfectivos.forEach(function (item) {
            if (item.id != -1) {
                total += item.importe;
            }
        });
        this.formularioViajePropioEfectivo.get('importeTotal').setValue(this.appComponent.establecerCeros(total));
    };
    //Envia la lista de tramos a Viaje
    ViajeEfectivoComponent.prototype.enviarDatos = function () {
        this.dataEvent.emit(this.listaEfectivos);
    };
    //Establece los ceros en los numeros flotantes
    ViajeEfectivoComponent.prototype.establecerCeros = function (elemento) {
        elemento.setValue(this.appComponent.establecerCeros(elemento.value));
    };
    //Establece los ceros en los numeros flotantes en tablas
    ViajeEfectivoComponent.prototype.establecerCerosTabla = function (elemento) {
        return this.appComponent.establecerCeros(elemento);
    };
    //Establece la lista de efectivos
    ViajeEfectivoComponent.prototype.establecerLista = function (lista) {
        this.establecerValoresPorDefecto(1);
        this.listaEfectivos = lista;
        this.calcularImporteTotal();
    };
    //Establece los campos solo lectura
    ViajeEfectivoComponent.prototype.establecerCamposSoloLectura = function (indice) {
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
    ViajeEfectivoComponent.prototype.establecerCamposSelectSoloLectura = function (opcion) {
        if (opcion) {
            this.formularioViajePropioEfectivo.get('empresa').disable();
        }
        else {
            this.formularioViajePropioEfectivo.get('empresa').enable();
        }
    };
    //Vacia la lista
    ViajeEfectivoComponent.prototype.vaciarListas = function () {
        this.listaEfectivos = [];
    };
    //Reestablece formulario y lista al cambiar de pestaña
    ViajeEfectivoComponent.prototype.reestablecerFormularioYLista = function () {
        this.vaciarListas();
        this.formularioViajePropioEfectivo.reset();
    };
    ViajeEfectivoComponent.prototype.compararFn = function (a, b) {
        if (a != null && b != null) {
            return a.id === b.id;
        }
    };
    //Abre un dialogo para ver las observaciones
    ViajeEfectivoComponent.prototype.verObservacionesDialogo = function (elemento) {
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
    ], ViajeEfectivoComponent.prototype, "dataEvent", void 0);
    ViajeEfectivoComponent = __decorate([
        core_1.Component({
            selector: 'app-viaje-efectivo',
            templateUrl: './viaje-efectivo.component.html',
            styleUrls: ['./viaje-efectivo.component.css']
        }),
        __metadata("design:paramtypes", [viajePropioEfectivo_1.ViajePropioEfectivo, empresa_service_1.EmpresaService,
            fecha_service_1.FechaService, app_component_1.AppComponent, material_1.MatDialog])
    ], ViajeEfectivoComponent);
    return ViajeEfectivoComponent;
}());
exports.ViajeEfectivoComponent = ViajeEfectivoComponent;
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
//# sourceMappingURL=viaje-efectivo.component.js.map