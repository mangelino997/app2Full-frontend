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
var viajePropioTramo_1 = require("src/app/modelos/viajePropioTramo");
var viajePropioTramoCliente_1 = require("src/app/modelos/viajePropioTramoCliente");
var tramo_service_1 = require("src/app/servicios/tramo.service");
var app_component_1 = require("src/app/app.component");
var empresa_service_1 = require("src/app/servicios/empresa.service");
var viaje_unidad_negocio_service_1 = require("src/app/servicios/viaje-unidad-negocio.service");
var viaje_tipo_carga_service_1 = require("src/app/servicios/viaje-tipo-carga.service");
var viaje_tipo_service_1 = require("src/app/servicios/viaje-tipo.service");
var viaje_tarifa_service_1 = require("src/app/servicios/viaje-tarifa.service");
var material_1 = require("@angular/material");
var cliente_service_1 = require("src/app/servicios/cliente.service");
var fecha_service_1 = require("src/app/servicios/fecha.service");
var ViajeTramoComponent = /** @class */ (function () {
    //Constructor
    function ViajeTramoComponent(appComponent, viajePropioTramoModelo, tramoServicio, empresaServicio, viajeUnidadNegocioServicio, viajeTipoCargaServicio, viajeTipoServicio, viajeTarifaServicio, dialog, fechaServicio) {
        this.appComponent = appComponent;
        this.viajePropioTramoModelo = viajePropioTramoModelo;
        this.tramoServicio = tramoServicio;
        this.empresaServicio = empresaServicio;
        this.viajeUnidadNegocioServicio = viajeUnidadNegocioServicio;
        this.viajeTipoCargaServicio = viajeTipoCargaServicio;
        this.viajeTipoServicio = viajeTipoServicio;
        this.viajeTarifaServicio = viajeTarifaServicio;
        this.dialog = dialog;
        this.fechaServicio = fechaServicio;
        //Evento que envia los datos del formulario a Viaje
        this.dataEvent = new core_1.EventEmitter();
        //Define la lista de resultados de vehiculos
        this.resultadosVehiculos = [];
        //Define la lista de resultados de vehiculos remolques
        this.resultadosVehiculosRemolques = [];
        //Define la lista de resultados de choferes
        this.resultadosChoferes = [];
        //Define la lista de resultados de tramos
        this.resultadosTramos = [];
        //Define la lista de empresas
        this.empresas = [];
        //Define la lista de unidades de negocios
        this.unidadesNegocios = [];
        //Define la lista de viajes tipos cargas
        this.viajesTiposCargas = [];
        //Define la lista de viajes tipos
        this.viajesTipos = [];
        //Define la lista de viajes tarifas
        this.viajesTarifas = [];
        //Define la lista de dedor-destinatario
        this.listaDadorDestinatario = [];
        //Define la lista de tramos (tabla)
        this.listaTramos = [];
        //Define si los campos son de solo lectura
        this.soloLectura = false;
        //Define si muestra el boton agregar tramo o actualizar tramo
        this.btnTramo = true;
        //Funcion para comparar y mostrar elemento de campo select
        this.compareFn = this.compararFn.bind(this);
    }
    //Al inicializarse el componente
    ViajeTramoComponent.prototype.ngOnInit = function () {
        var _this = this;
        //Establece el formulario viaje propio tramo
        this.formularioViajePropioTramo = this.viajePropioTramoModelo.formulario;
        //Autocompletado Tramo - Buscar por alias
        this.formularioViajePropioTramo.get('tramo').valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.tramoServicio.listarPorOrigen(data).subscribe(function (response) {
                    _this.resultadosTramos = response;
                });
            }
        });
        //Establece el numero de orden del tramo por defecto en cero
        this.numeroOrden = 0;
        //Obtiene la lista de empresas
        this.listarEmpresas();
        //Obtiene la lista de unidades de negocios
        this.listarUnidadesNegocios();
        //Obtiene la lista de viajes tipos cargas
        this.listarViajesTiposCargas();
        //Obtiene la lista de viajes tipos
        this.listarViajesTipos();
        //Obtiene la lista de viajes tarifas
        this.listarViajesTarifas();
        //Establece los valores por defecto del formulario viaje tramo
        this.establecerValoresPorDefecto();
    };
    //Establece los valores por defecto del formulario viaje tramo
    ViajeTramoComponent.prototype.establecerValoresPorDefecto = function () {
        var _this = this;
        var valor = 0;
        //Establece la fecha actual
        this.fechaServicio.obtenerFecha().subscribe(function (res) {
            _this.formularioViajePropioTramo.get('fechaTramo').setValue(res.json());
        });
        this.formularioViajePropioTramo.get('cantidad').setValue(valor);
        this.formularioViajePropioTramo.get('precioUnitario').setValue(this.appComponent.establecerCeros(valor));
        this.formularioViajePropioTramo.get('importe').setValue(this.appComponent.establecerCeros(valor));
    };
    //Obtiene el listado de empresas
    ViajeTramoComponent.prototype.listarEmpresas = function () {
        var _this = this;
        this.empresaServicio.listar().subscribe(function (res) {
            _this.empresas = res.json();
        }, function (err) {
            console.log(err);
        });
    };
    //Obtiene el listado de unidades de negocio
    ViajeTramoComponent.prototype.listarUnidadesNegocios = function () {
        var _this = this;
        this.viajeUnidadNegocioServicio.listar().subscribe(function (res) {
            _this.unidadesNegocios = res.json();
        }, function (err) {
            console.log(err);
        });
    };
    //Obtiene el listado de viaje tipo carga
    ViajeTramoComponent.prototype.listarViajesTiposCargas = function () {
        var _this = this;
        this.viajeTipoCargaServicio.listar().subscribe(function (res) {
            _this.viajesTiposCargas = res.json();
        }, function (err) {
            console.log(err);
        });
    };
    //Obtiene el listado de viajes tipos
    ViajeTramoComponent.prototype.listarViajesTipos = function () {
        var _this = this;
        this.viajeTipoServicio.listar().subscribe(function (res) {
            _this.viajesTipos = res.json();
        }, function (err) {
            console.log(err);
        });
    };
    //Obtiene el listado de viajes tarifas
    ViajeTramoComponent.prototype.listarViajesTarifas = function () {
        var _this = this;
        this.viajeTarifaServicio.listar().subscribe(function (res) {
            _this.viajesTarifas = res.json();
        }, function (err) {
            console.log(err);
        });
    };
    //Calcula el importe a partir de cantidad/km y precio unitario
    ViajeTramoComponent.prototype.calcularImporte = function (formulario) {
        var cantidad = formulario.get('cantidad').value;
        var precioUnitario = formulario.get('precioUnitario').value;
        formulario.get('precioUnitario').setValue(parseFloat(precioUnitario).toFixed(2));
        if (cantidad != null && precioUnitario != null) {
            var importe = cantidad * precioUnitario;
            formulario.get('importe').setValue(importe);
            this.establecerCeros(formulario.get('importe'));
            // formulario.get('importe').setValue(importe.toFixed(2));
        }
    };
    //Verifica el elemento seleccionado en Tarifa para determinar si coloca cantidad e importe en solo lectura
    ViajeTramoComponent.prototype.estadoTarifa = function () {
        try {
            var viajeTarifa = this.formularioViajePropioTramo.get('viajeTarifa').value.id;
            return viajeTarifa == 2 || viajeTarifa == 5;
        }
        catch (e) {
            return false;
        }
    };
    //Agrega datos a la tabla de tramos
    ViajeTramoComponent.prototype.agregarTramo = function () {
        this.numeroOrden++;
        this.formularioViajePropioTramo.get('numeroOrden').setValue(this.numeroOrden);
        var fecha = this.formularioViajePropioTramo.get('fechaTramo').value;
        this.formularioViajePropioTramo.get('fechaAlta').setValue(fecha);
        var km = this.formularioViajePropioTramo.get('tramo').value.km;
        this.formularioViajePropioTramo.get('km').setValue(km);
        this.formularioViajePropioTramo.get('usuario').setValue(this.appComponent.getUsuario());
        this.listaTramos.push(this.formularioViajePropioTramo.value);
        this.formularioViajePropioTramo.reset();
        this.establecerValoresPorDefecto();
        document.getElementById('idTramoFecha').focus();
        this.enviarDatos();
    };
    //Modifica los datos del tramo
    ViajeTramoComponent.prototype.modificarTramo = function () {
        this.listaTramos[this.indiceTramo] = this.formularioViajePropioTramo.value;
        this.btnTramo = true;
        this.formularioViajePropioTramo.reset();
        this.establecerValoresPorDefecto();
        document.getElementById('idTramoFecha').focus();
        this.enviarDatos();
    };
    //Modifica un tramo de la tabla por indice
    ViajeTramoComponent.prototype.modTramo = function (indice) {
        this.indiceTramo = indice;
        this.btnTramo = false;
        this.formularioViajePropioTramo.patchValue(this.listaTramos[indice]);
    };
    //Elimina un tramo de la tabla por indice
    ViajeTramoComponent.prototype.eliminarTramo = function (indice, elemento) {
        this.listaTramos[indice].id = elemento.id * (-1);
        document.getElementById('idTramoFecha').focus();
        this.enviarDatos();
    };
    //Envia la lista de tramos a Viaje
    ViajeTramoComponent.prototype.enviarDatos = function () {
        this.dataEvent.emit(this.listaTramos);
    };
    //Establece los ceros en los numeros flotantes
    ViajeTramoComponent.prototype.establecerCeros = function (elemento) {
        elemento.setValue(this.appComponent.establecerCeros(elemento.value));
    };
    //Establece la lista de tramos
    ViajeTramoComponent.prototype.establecerLista = function (lista) {
        this.establecerValoresPorDefecto();
        this.listaTramos = lista;
    };
    //Establece los campos solo lectura
    ViajeTramoComponent.prototype.establecerCamposSoloLectura = function (indice) {
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
    ViajeTramoComponent.prototype.establecerCamposSelectSoloLectura = function (opcion) {
        if (opcion) {
            this.formularioViajePropioTramo.get('empresa').disable();
            this.formularioViajePropioTramo.get('viajeUnidadNegocio').disable();
            this.formularioViajePropioTramo.get('viajeTipoCarga').disable();
            this.formularioViajePropioTramo.get('viajeTipo').disable();
            this.formularioViajePropioTramo.get('viajeTarifa').disable();
        }
        else {
            this.formularioViajePropioTramo.get('empresa').enable();
            this.formularioViajePropioTramo.get('viajeUnidadNegocio').enable();
            this.formularioViajePropioTramo.get('viajeTipoCarga').enable();
            this.formularioViajePropioTramo.get('viajeTipo').enable();
            this.formularioViajePropioTramo.get('viajeTarifa').enable();
        }
    };
    //Vacia la lista
    ViajeTramoComponent.prototype.vaciarListas = function () {
        this.listaTramos = [];
    };
    //Reestablece formulario y lista al cambiar de pestaña
    ViajeTramoComponent.prototype.reestablecerFormularioYLista = function () {
        this.vaciarListas();
        this.formularioViajePropioTramo.reset();
    };
    ViajeTramoComponent.prototype.compararFn = function (a, b) {
        if (a != null && b != null) {
            return a.id === b.id;
        }
    };
    //Define como se muestra los datos en el autcompletado c
    ViajeTramoComponent.prototype.displayFn = function (elemento) {
        if (elemento != undefined) {
            return elemento.origen ? elemento.origen.nombre + ', ' + elemento.origen.provincia.nombre +
                ' ---> ' + elemento.destino.nombre + ', ' + elemento.destino.provincia.nombre + ' (' + elemento.km + 'km)' : elemento;
        }
        else {
            return elemento;
        }
    };
    //Abre un dialogo para agregar dadores y destinatarios
    ViajeTramoComponent.prototype.verDadorDestinatarioDialogo = function () {
        var _this = this;
        var dialogRef = this.dialog.open(DadorDestinatarioDialogo, {
            width: '1200px',
            data: {
                tema: this.appComponent.getTema()
            }
        });
        dialogRef.afterClosed().subscribe(function (viajePropioTramoClientes) {
            _this.formularioViajePropioTramo.get('viajePropioTramoClientes').setValue(viajePropioTramoClientes);
        });
    };
    //Abre un dialogo para ver la lista de dadores y destinatarios
    ViajeTramoComponent.prototype.verDadorDestTablaDialogo = function (elemento) {
        var dialogRef = this.dialog.open(DadorDestTablaDialogo, {
            width: '1200px',
            data: {
                tema: this.appComponent.getTema(),
                elemento: elemento
            }
        });
        dialogRef.afterClosed().subscribe(function (resultado) { });
    };
    //Abre un dialogo para ver las observaciones
    ViajeTramoComponent.prototype.verObservacionesDialogo = function (elemento) {
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
    ], ViajeTramoComponent.prototype, "dataEvent", void 0);
    ViajeTramoComponent = __decorate([
        core_1.Component({
            selector: 'app-viaje-tramo',
            templateUrl: './viaje-tramo.component.html',
            styleUrls: ['./viaje-tramo.component.css']
        }),
        __metadata("design:paramtypes", [app_component_1.AppComponent, viajePropioTramo_1.ViajePropioTramo,
            tramo_service_1.TramoService,
            empresa_service_1.EmpresaService, viaje_unidad_negocio_service_1.ViajeUnidadNegocioService,
            viaje_tipo_carga_service_1.ViajeTipoCargaService, viaje_tipo_service_1.ViajeTipoService,
            viaje_tarifa_service_1.ViajeTarifaService, material_1.MatDialog, fecha_service_1.FechaService])
    ], ViajeTramoComponent);
    return ViajeTramoComponent;
}());
exports.ViajeTramoComponent = ViajeTramoComponent;
//Componente DadorDestinatarioDialogo
var DadorDestinatarioDialogo = /** @class */ (function () {
    //Constructor
    function DadorDestinatarioDialogo(dialogRef, data, viajePropioTramoClienteModelo, clienteServicio) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.viajePropioTramoClienteModelo = viajePropioTramoClienteModelo;
        this.clienteServicio = clienteServicio;
        //Define la lista de dador-destinatario
        this.listaDadorDestinatario = [];
        //Define la lista de clientes
        this.resultadosClientes = [];
    }
    DadorDestinatarioDialogo.prototype.ngOnInit = function () {
        var _this = this;
        //Establece el tema
        this.tema = this.data.tema;
        //Establece el formulario
        this.formulario = this.viajePropioTramoClienteModelo.formulario;
        //Autocompletado Cliente Dador - Buscar por alias
        this.formulario.get('clienteDador').valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.clienteServicio.listarPorAlias(data).subscribe(function (response) {
                    _this.resultadosClientes = response;
                });
            }
        });
        //Autocompletado Cliente Destinatario - Buscar por alias
        this.formulario.get('clienteDestinatario').valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.clienteServicio.listarPorAlias(data).subscribe(function (response) {
                    _this.resultadosClientes = response;
                });
            }
        });
    };
    DadorDestinatarioDialogo.prototype.onNoClick = function () {
        this.dialogRef.close();
    };
    //Agrega el dador y el destinatario a la tabla
    DadorDestinatarioDialogo.prototype.agregarDadorDestinatario = function () {
        this.listaDadorDestinatario.push(this.formulario.value);
        this.formulario.reset();
        document.getElementById('idTramoDadorCarga').focus();
    };
    //Elimina un dador-destinatario de la tabla
    DadorDestinatarioDialogo.prototype.eliminarDadorDestinatario = function (indice) {
        this.listaDadorDestinatario.splice(indice, 1);
        document.getElementById('idTramoDadorCarga').focus();
    };
    //Define como se muestra los datos en el autcompletado b
    DadorDestinatarioDialogo.prototype.displayFb = function (elemento) {
        if (elemento != undefined) {
            return elemento.alias ? elemento.alias : elemento;
        }
        else {
            return elemento;
        }
    };
    DadorDestinatarioDialogo = __decorate([
        core_1.Component({
            selector: 'dador-destinatario-dialogo',
            templateUrl: 'dador-destinatario-dialogo.component.html'
        }),
        __param(1, core_1.Inject(material_1.MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [material_1.MatDialogRef, Object, viajePropioTramoCliente_1.ViajePropioTramoCliente, cliente_service_1.ClienteService])
    ], DadorDestinatarioDialogo);
    return DadorDestinatarioDialogo;
}());
exports.DadorDestinatarioDialogo = DadorDestinatarioDialogo;
//Componente DadorDestTablaDialogo
var DadorDestTablaDialogo = /** @class */ (function () {
    //Constructor
    function DadorDestTablaDialogo(dialogRef, data) {
        this.dialogRef = dialogRef;
        this.data = data;
        //Define la observacion
        this.listaDadorDestinatario = [];
    }
    DadorDestTablaDialogo.prototype.ngOnInit = function () {
        //Establece el tema
        this.tema = this.data.tema;
        //Establece la lista de dadores-destinatarios
        this.listaDadorDestinatario = this.data.elemento.viajePropioTramoClientes;
    };
    DadorDestTablaDialogo.prototype.onNoClick = function () {
        this.dialogRef.close();
    };
    DadorDestTablaDialogo = __decorate([
        core_1.Component({
            selector: 'dador-dest-tabla-dialogo',
            templateUrl: 'dador-dest-tabla-dialogo.component.html'
        }),
        __param(1, core_1.Inject(material_1.MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [material_1.MatDialogRef, Object])
    ], DadorDestTablaDialogo);
    return DadorDestTablaDialogo;
}());
exports.DadorDestTablaDialogo = DadorDestTablaDialogo;
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
//# sourceMappingURL=viaje-tramo.component.js.map