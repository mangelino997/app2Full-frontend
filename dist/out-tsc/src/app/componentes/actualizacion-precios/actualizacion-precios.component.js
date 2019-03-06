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
var ngx_toastr_1 = require("ngx-toastr");
var empresa_service_1 = require("src/app/servicios/empresa.service");
var actualizacionPrecios_1 = require("src/app/modelos/actualizacionPrecios");
var orden_venta_service_1 = require("src/app/servicios/orden-venta.service");
var orden_venta_tramo_service_1 = require("src/app/servicios/orden-venta-tramo.service");
var orden_venta_escala_service_1 = require("src/app/servicios/orden-venta-escala.service");
var material_1 = require("@angular/material");
var ActualizacionPreciosComponent = /** @class */ (function () {
    //Constructor
    function ActualizacionPreciosComponent(servicio, actualizacionPrecios, ordenVentaTramoServicio, ordenVentaEscalaServicio, empresaServicio, ordenVentaServicio, toastr, dialog) {
        var _this = this;
        this.servicio = servicio;
        this.actualizacionPrecios = actualizacionPrecios;
        this.ordenVentaTramoServicio = ordenVentaTramoServicio;
        this.ordenVentaEscalaServicio = ordenVentaEscalaServicio;
        this.empresaServicio = empresaServicio;
        this.ordenVentaServicio = ordenVentaServicio;
        this.toastr = toastr;
        this.dialog = dialog;
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
        //Define la variable como un boolean
        this.porEscala = false;
        //Define si mostrar el boton
        this.mostrarBoton = null;
        //Define que campo muestra
        this.buscarPorCliente = null;
        //Define la lista de pestanias
        this.pestanias = [];
        //Define la lista completa de registros
        this.listaCompleta = [];
        //Define la lista completa de registros (ordenes de venta) filtrados por la fecha de precio desde
        this.listaFiltrada = [];
        //Define la lista completa de registros
        this.empresas = [];
        //Define el autocompletado
        this.autocompletado = new forms_1.FormControl();
        //Define como formControl
        this.precioDesde = new forms_1.FormControl();
        //Define el campo como un formControl
        this.buscarPor = new forms_1.FormControl();
        //Define el campo como un formControl
        this.aumento = new forms_1.FormControl();
        //Define el campo como un formControl
        this.empresa = new forms_1.FormControl();
        //Define los datos de la tabla OrdenVentaTramo/OrdenVentaEscala segun la orden venta seleccionada
        this.ordenVenta = [];
        //Define los resultados del autocompletado
        this.resultados = [];
        //Define los resultados de autocompletado localidad
        this.resultadosLocalidades = [];
        //Funcion para comparar y mostrar elemento de campo select
        this.compareFn = this.compararFn.bind(this);
        //Defiene autocompletado de Clientes
        this.autocompletado.valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.servicio.listarPorNombre(data).subscribe(function (res) {
                    _this.resultados = res;
                });
            }
        });
    }
    //Al iniciarse el componente
    ActualizacionPreciosComponent.prototype.ngOnInit = function () {
        //Define el formulario y validaciones
        this.formulario = this.actualizacionPrecios.formulario;
        //Setea el campo a buscar por defecto
        this.buscarPor.setValue(1);
        //Obtiene la lista completa de registros
        this.listarEmpresas();
        //Setea por defecto que el combo sea un aumento de precio
        this.aumento.setValue(1);
    };
    //Obtiene el listado de registros
    ActualizacionPreciosComponent.prototype.listarEmpresas = function () {
        var _this = this;
        this.empresaServicio.listar().subscribe(function (res) {
            console.log(res.json());
            _this.empresas = res.json();
        }, function (err) {
            console.log(err);
        });
    };
    //Actualiza un registro
    ActualizacionPreciosComponent.prototype.actualizar = function () {
        // this.servicio.actualizar(this.formulario.value).subscribe(
        //   res => {
        //     var respuesta = res.json();
        //     if(respuesta.codigo == 200) {
        //       this.reestablecerFormulario(undefined);
        //       setTimeout(function() {
        //         document.getElementById('idAutocompletado').focus();
        //       }, 20);
        //       this.toastr.success(respuesta.mensaje);
        //     }
        //   },
        //   err => {
        //     var respuesta = err.json();
        //     if(respuesta.codigo == 11002) {
        //       document.getElementById("labelNombre").classList.add('label-error');
        //       document.getElementById("idNombre").classList.add('is-invalid');
        //       document.getElementById("idNombre").focus();
        //       this.toastr.error(respuesta.mensaje);
        //     }
        //   }
        // );
    };
    //Realiza el cambio de campo a buscar
    ActualizacionPreciosComponent.prototype.cambioDeCampo = function () {
        if (this.buscarPor.value == 0) {
            this.buscarPorCliente = true;
        }
        else {
            this.buscarPorCliente = false;
        }
    };
    //Carga la Tabla 
    ActualizacionPreciosComponent.prototype.cargarTabla = function (opcion, id) {
        var _this = this;
        this.listaCompleta = [];
        if (opcion == 0) {
            this.ordenVentaServicio.listarPorCliente(id).subscribe(function (res) {
                _this.listaCompleta = res.json();
            }, function (err) {
            });
        }
        else {
            this.ordenVentaServicio.listarPorEmpresa(this.empresa.value.id).subscribe(function (res) {
                _this.listaCompleta = res.json();
            }, function (err) {
            });
        }
    };
    //Controla los checkbox
    ActualizacionPreciosComponent.prototype.ordenSeleccionada = function (indice, $event) {
        var checkboxs = document.getElementsByTagName('mat-checkbox');
        for (var i = 0; i < checkboxs.length; i++) {
            var id = "mat-checkbox-" + (i + 1);
            if (i == indice && $event.checked == true) {
                document.getElementById(id).className = "checkBoxSelected";
                this.buscarPorOrdenPrecios(i);
            }
            else {
                document.getElementById(id).className = "checkBoxNotSelected";
                document.getElementById(id)['checked'] = false;
            }
        }
    };
    //Busca los datos segun la Orden seleccionada
    ActualizacionPreciosComponent.prototype.buscarPorOrdenPrecios = function (indice) {
        var _this = this;
        this.ordenVenta = [];
        this.porEscala = this.listaCompleta[indice].tipoTarifa.porEscala; //true o false
        this.indiceSeleccionado = indice;
        if (this.listaCompleta[indice].tipoTarifa.porEscala == true) {
            this.ordenVentaEscalaServicio.listarPorOrdenVenta(this.listaCompleta[indice].id).subscribe(function (res) {
                _this.ordenVenta = res.json();
                _this.formulario.get('fechaDesde').setValue(_this.ordenVenta[_this.ordenVenta.length - 1].preciosDesde);
                _this.filtrarPorPrecioDesde(_this.ordenVenta);
            }, function (err) {
            });
        }
        else {
            this.ordenVentaTramoServicio.listarPorOrdenVenta(this.listaCompleta[indice].id).subscribe(function (res) {
                _this.ordenVenta = res.json();
                _this.formulario.get('fechaDesde').setValue(_this.ordenVenta[_this.ordenVenta.length - 1].preciosDesde);
                _this.filtrarPorPrecioDesde(_this.ordenVenta);
            }, function (err) {
            });
        }
    };
    //Filtra las ordenes de venta y carga en la lista los de la fecha de precioDesde
    ActualizacionPreciosComponent.prototype.filtrarPorPrecioDesde = function (ordenesDeVenta) {
        this.listaFiltrada = [];
        var fechaFiltro = this.formulario.get('fechaDesde').value;
        for (var i = 0; i < ordenesDeVenta.length; i++) {
            if (ordenesDeVenta[i].preciosDesde == fechaFiltro)
                this.listaFiltrada.push(ordenesDeVenta[i]);
        }
    };
    //Abre un Modal con la lista de precios para la fecha de precioDesde
    ActualizacionPreciosComponent.prototype.listaDePrecios = function () {
        var dialogRef = this.dialog.open(ListaPreciosDialogo, {
            width: '1100px',
            data: { fecha: this.formulario.get('fechaDesde').value, listaFiltrada: this.listaFiltrada, porEscala: this.porEscala },
        });
        dialogRef.afterClosed().subscribe(function (result) {
        });
    };
    //Abre un modal con los datos actualizados antes de confirmar 
    ActualizacionPreciosComponent.prototype.confirmar = function () {
        var _this = this;
        var dialogRef = this.dialog.open(ConfimarDialogo, {
            width: '1100px',
            data: {
                formulario: this.ordenVenta,
                porEscala: this.porEscala
            },
        });
        dialogRef.afterClosed().subscribe(function (result) {
            _this.formulario.get('fechaDesde').setValue(_this.formulario.get('precioDesde').value);
            _this.reestablecerFormulario(undefined);
        });
    };
    //Reestablece el formulario
    ActualizacionPreciosComponent.prototype.reestablecerFormulario = function (id) {
        this.listaCompleta = [];
        this.formulario.get('precioDesde').setValue(null);
        this.formulario.get('porcentaje').setValue(null);
        this.empresa.setValue(null);
        this.autocompletado.setValue(null);
    };
    //Realiza la actualizacion del precio de la orden seleccionada
    ActualizacionPreciosComponent.prototype.aplicarActualizacion = function () {
        switch (this.aumento.value) {
            case 0:
                this.aplicarAnulacion();
                break;
            case 1:
                this.aplicarAumento();
                break;
        }
    };
    //Aplica un aumento de porcentaje en los precios de la orden venta seleccionada
    ActualizacionPreciosComponent.prototype.aplicarAumento = function () {
        var porcentaje = this.formulario.get('porcentaje').value;
        if (this.porEscala == true) {
            for (var i = 0; i < this.ordenVenta.length; i++) {
                if (this.ordenVenta[i].importeFijo != 0 && this.ordenVenta[i].importeFijo != null)
                    this.ordenVenta[i].importeFijo = this.ordenVenta[i].importeFijo + this.ordenVenta[i].importeFijo * (porcentaje / 100);
                if (this.ordenVenta[i].precioUnitario != 0 && this.ordenVenta[i].precioUnitario != null)
                    this.ordenVenta[i].precioUnitario = this.ordenVenta[i].precioUnitario + this.ordenVenta[i].precioUnitario * (porcentaje / 100);
            }
        }
        else {
            for (var i = 0; i < this.ordenVenta.length; i++) {
                if (this.ordenVenta[i].importeFijoSeco != 0 && this.ordenVenta[i].importeFijoSeco != null)
                    this.ordenVenta[i].importeFijoSeco = this.ordenVenta[i].importeFijoSeco + this.ordenVenta[i].importeFijoSeco * (porcentaje / 100);
                if (this.ordenVenta[i].importeFijoRef != 0 && this.ordenVenta[i].importeFijoRef != null)
                    this.ordenVenta[i].importeFijoRef = this.ordenVenta[i].importeFijoRef + this.ordenVenta[i].importeFijoRef * (porcentaje / 100);
                if (this.ordenVenta[i].precioUnitarioRef != 0 && this.ordenVenta[i].precioUnitarioRef != null)
                    this.ordenVenta[i].precioUnitarioRef = this.ordenVenta[i].precioUnitarioRef + this.ordenVenta[i].precioUnitarioRef * (porcentaje / 100);
                if (this.ordenVenta[i].precioUnitarioSeco != 0 && this.ordenVenta[i].precioUnitarioSeco != null)
                    this.ordenVenta[i].precioUnitarioSeco = this.ordenVenta[i].precioUnitarioSeco + this.ordenVenta[i].precioUnitarioSeco * (porcentaje / 100);
            }
        }
    };
    //Aplica una anulacion de porcentaje en los precios de la orden de venta seleccionada
    ActualizacionPreciosComponent.prototype.aplicarAnulacion = function () {
        var porcentaje = this.formulario.get('porcentaje').value;
        if (this.porEscala == true) {
            for (var i = 0; i < this.ordenVenta.length; i++) {
                if (this.ordenVenta[i].importeFijo != 0 && this.ordenVenta[i].importeFijo != null)
                    this.ordenVenta[i].importeFijo = this.ordenVenta[i].importeFijo - this.ordenVenta[i].importeFijo * (porcentaje / 100);
                if (this.ordenVenta[i].precioUnitario != 0 && this.ordenVenta[i].precioUnitario != null)
                    this.ordenVenta[i].precioUnitario = this.ordenVenta[i].precioUnitario - this.ordenVenta[i].precioUnitario * (porcentaje / 100);
            }
        }
        else {
            for (var i = 0; i < this.ordenVenta.length; i++) {
                if (this.ordenVenta[i].importeFijoSeco != 0 && this.ordenVenta[i].importeFijoSeco != null)
                    this.ordenVenta[i].importeFijoSeco = this.ordenVenta[i].importeFijoSeco - this.ordenVenta[i].importeFijoSeco * (porcentaje / 100);
                if (this.ordenVenta[i].importeFijoRef != 0 && this.ordenVenta[i].importeFijoRef != null)
                    this.ordenVenta[i].importeFijoRef = this.ordenVenta[i].importeFijoRef - this.ordenVenta[i].importeFijoRef * (porcentaje / 100);
                if (this.ordenVenta[i].precioUnitarioRef != 0 && this.ordenVenta[i].precioUnitarioRef != null)
                    this.ordenVenta[i].precioUnitarioRef = this.ordenVenta[i].precioUnitarioRef - this.ordenVenta[i].precioUnitarioRef * (porcentaje / 100);
                if (this.ordenVenta[i].precioUnitarioSeco != 0 && this.ordenVenta[i].precioUnitarioSeco != null)
                    this.ordenVenta[i].precioUnitarioSeco = this.ordenVenta[i].precioUnitarioSeco - this.ordenVenta[i].precioUnitarioSeco * (porcentaje / 100);
            }
        }
    };
    //Valida que la nueva fechaDesde sea mayor a la de precioDesde
    ActualizacionPreciosComponent.prototype.validarNuevaFechaDesde = function () {
        if (this.formulario.get('precioDesde').value > this.formulario.get('fechaDesde').value) {
            document.getElementById('btn-confirm').focus();
            if (this.porEscala == true) {
                for (var i = 0; i < this.ordenVenta.length; i++) {
                    this.ordenVenta[i].preciosDesde = this.formulario.get('precioDesde').value;
                }
            }
            else {
                for (var i = 0; i < this.ordenVenta.length; i++) {
                    this.ordenVenta[i].preciosDesde = this.formulario.get('precioDesde').value;
                }
            }
        }
        else {
            this.formulario.get('precioDesde').setValue(null);
            document.getElementById('idNuevoPrecioDesde').focus();
            this.toastr.error("¡La nueva fecha debe ser mayor a la anterior!");
        }
    };
    //Define como se muestra los datos en el autcompletado
    ActualizacionPreciosComponent.prototype.displayFn = function (elemento) {
        if (elemento != undefined) {
            return elemento.nombre ? elemento.nombre : elemento;
        }
        else {
            return elemento;
        }
    };
    //Formatea el valor del autocompletado a
    ActualizacionPreciosComponent.prototype.displayFa = function (elemento) {
        if (elemento != undefined) {
            return elemento.alias ? elemento.alias : elemento;
        }
        else {
            return elemento;
        }
    };
    ActualizacionPreciosComponent.prototype.compararFn = function (a, b) {
        if (a != null && b != null) {
            return a.id === b.id;
        }
    };
    ActualizacionPreciosComponent = __decorate([
        core_1.Component({
            selector: 'app-actualizacion-precios',
            templateUrl: './actualizacion-precios.component.html',
            styleUrls: ['./actualizacion-precios.component.css']
        }),
        __metadata("design:paramtypes", [orden_venta_service_1.OrdenVentaService, actualizacionPrecios_1.ActualizacionPrecios,
            orden_venta_tramo_service_1.OrdenVentaTramoService, orden_venta_escala_service_1.OrdenVentaEscalaService, empresa_service_1.EmpresaService, orden_venta_service_1.OrdenVentaService,
            ngx_toastr_1.ToastrService, material_1.MatDialog])
    ], ActualizacionPreciosComponent);
    return ActualizacionPreciosComponent;
}());
exports.ActualizacionPreciosComponent = ActualizacionPreciosComponent;
var ListaPreciosDialogo = /** @class */ (function () {
    function ListaPreciosDialogo(dialogRef, data, toastr) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.toastr = toastr;
        //Define la lista de usuarios activos de la empresa
        this.listaPrecios = [];
    }
    ListaPreciosDialogo.prototype.ngOnInit = function () {
        this.listaPrecios = this.data.listaFiltrada;
        this.fecha = this.data.fecha;
        this.porEscala = this.data.porEscala; //controlo que tabla muestro en el modal
    };
    ListaPreciosDialogo.prototype.onNoClick = function () {
        this.dialogRef.close();
        document.getElementById('idActualizacion').focus();
    };
    ListaPreciosDialogo = __decorate([
        core_1.Component({
            selector: 'lista-precios-dialogo',
            templateUrl: 'lista-precios.html',
        }),
        __param(1, core_1.Inject(material_1.MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [material_1.MatDialogRef, Object, ngx_toastr_1.ToastrService])
    ], ListaPreciosDialogo);
    return ListaPreciosDialogo;
}());
exports.ListaPreciosDialogo = ListaPreciosDialogo;
var ConfimarDialogo = /** @class */ (function () {
    function ConfimarDialogo(dialogRef, data, toastr, ordenVentaTramoServicio, ordenVentaEscalaServicio) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.toastr = toastr;
        this.ordenVentaTramoServicio = ordenVentaTramoServicio;
        this.ordenVentaEscalaServicio = ordenVentaEscalaServicio;
        //Define el formulario que envía a la base de datos
        this.formulario = [];
    }
    ConfimarDialogo.prototype.ngOnInit = function () {
        this.formulario = this.data.formulario;
        this.porEscala = this.data.porEscala; //controlo que tabla muestro en el modal
        console.log(this.data.formulario);
    };
    ConfimarDialogo.prototype.actualizar = function () {
        var _this = this;
        if (this.porEscala == true) {
            this.ordenVentaEscalaServicio.agregar(this.formulario).subscribe(function (res) {
                var respuesta = res.json();
                if (respuesta.codigo == 200) {
                    setTimeout(function () {
                        document.getElementById('idAutocompletado').focus();
                    }, 20);
                    _this.toastr.success(respuesta.mensaje);
                }
            }, function (err) {
                var respuesta = err.json();
                if (respuesta.codigo == 11002) {
                    document.getElementById("labelNombre").classList.add('label-error');
                    document.getElementById("idNombre").classList.add('is-invalid');
                    document.getElementById("idNombre").focus();
                    _this.toastr.error(respuesta.mensaje);
                }
            });
        }
        else {
            this.ordenVentaTramoServicio.agregar(this.formulario).subscribe(function (res) {
                var respuesta = res.json();
                if (respuesta.codigo == 200) {
                    setTimeout(function () {
                        document.getElementById('idAutocompletado').focus();
                    }, 20);
                    _this.toastr.success(respuesta.mensaje);
                }
            }, function (err) {
                var respuesta = err.json();
                if (respuesta.codigo == 11002) {
                    document.getElementById("labelNombre").classList.add('label-error');
                    document.getElementById("idNombre").classList.add('is-invalid');
                    document.getElementById("idNombre").focus();
                    _this.toastr.error(respuesta.mensaje);
                }
            });
        }
    };
    ConfimarDialogo.prototype.onNoClick = function () {
        this.dialogRef.close();
        document.getElementById('idActualizacion').focus();
    };
    ConfimarDialogo = __decorate([
        core_1.Component({
            selector: 'confirmar-dialogo',
            templateUrl: 'confirmar-modal.html',
        }),
        __param(1, core_1.Inject(material_1.MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [material_1.MatDialogRef, Object, ngx_toastr_1.ToastrService,
            orden_venta_tramo_service_1.OrdenVentaTramoService, orden_venta_escala_service_1.OrdenVentaEscalaService])
    ], ConfimarDialogo);
    return ConfimarDialogo;
}());
exports.ConfimarDialogo = ConfimarDialogo;
//# sourceMappingURL=actualizacion-precios.component.js.map