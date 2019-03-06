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
var fecha_service_1 = require("src/app/servicios/fecha.service");
var ngx_toastr_1 = require("ngx-toastr");
var app_component_1 = require("../../app.component");
var forms_1 = require("@angular/forms");
var app_service_1 = require("../../servicios/app.service");
var subopcion_pestania_service_1 = require("src/app/servicios/subopcion-pestania.service");
var ordenRecoleccion_1 = require("src/app/modelos/ordenRecoleccion");
var cliente_service_1 = require("src/app/servicios/cliente.service");
var localidad_service_1 = require("src/app/servicios/localidad.service");
var barrio_service_1 = require("src/app/servicios/barrio.service");
var orden_recoleccion_service_1 = require("src/app/servicios/orden-recoleccion.service");
var sucursal_service_1 = require("src/app/servicios/sucursal.service");
var material_1 = require("@angular/material");
var cliente_eventual_component_1 = require("../cliente-eventual/cliente-eventual.component");
var OrdenRecoleccionComponent = /** @class */ (function () {
    function OrdenRecoleccionComponent(ordenRecoleccion, subopcionPestaniaService, appComponent, fechaServicio, localidadService, clienteService, toastr, barrioService, appService, servicio, sucursalService, dialog, clienteServicio) {
        var _this = this;
        this.ordenRecoleccion = ordenRecoleccion;
        this.subopcionPestaniaService = subopcionPestaniaService;
        this.appComponent = appComponent;
        this.fechaServicio = fechaServicio;
        this.localidadService = localidadService;
        this.clienteService = clienteService;
        this.toastr = toastr;
        this.barrioService = barrioService;
        this.appService = appService;
        this.servicio = servicio;
        this.sucursalService = sucursalService;
        this.dialog = dialog;
        this.clienteServicio = clienteServicio;
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
        //Define si los campos de seleccion son de solo lectura
        this.selectSoloLectura = false;
        //Define si mostrar el boton
        this.mostrarBoton = null;
        //Define si muestra los datos (localidad-barrio-provincia) del cliente
        this.mostrarCliente = false;
        //Define una lista
        this.lista = null;
        //Define la lista para las Escalas agregadas
        this.listaDeEscalas = [];
        //Define la lista para los tramos agregados
        this.listaDeTramos = [];
        //Define la lista de pestanias
        this.pestanias = null;
        //Define el siguiente id
        this.siguienteId = null;
        //Define la lista completa de registros
        this.listaCompleta = null;
        //Define el form control para el remitente
        this.cliente = new forms_1.FormControl();
        this.domicilioBarrio = new forms_1.FormControl();
        this.localidadProvincia = new forms_1.FormControl();
        //Define la lista de resultados de busqueda
        this.resultados = [];
        //Define el form control para las busquedas cliente
        this.buscarCliente = new forms_1.FormControl();
        //Define la lista de resultados de busqueda cliente
        this.resultadosClientes = [];
        //Define la lista de resultados de busqueda localidad
        this.resultadosLocalidades = [];
        //Define la lista de resultados de sucursales
        this.resultadosSucursales = [];
        //Define el autocompletado para las busquedas
        this.autocompletado = new forms_1.FormControl();
        //Define la lista de resultados de busqueda barrio
        this.resultadosBarrios = [];
        //Funcion para comparar y mostrar elemento de campo select
        this.compareFn = this.compararFn.bind(this);
        //Obtiene la lista de pestania por rol y subopcion
        this.subopcionPestaniaService.listarPorRolSubopcion(this.appComponent.getRol(), this.appComponent.getSubopcion())
            .subscribe(function (res) {
            _this.pestanias = res.json();
            _this.activeLink = _this.pestanias[0].nombre;
        }, function (err) {
        });
    }
    OrdenRecoleccionComponent.prototype.ngOnInit = function () {
        var _this = this;
        //Define el formulario de orden venta
        this.formulario = this.ordenRecoleccion.formulario;
        this.reestablecerFormulario(undefined);
        //Establece los valores de la primera pestania activa
        this.seleccionarPestania(1, 'Agregar', 0);
        //Lista todos los registros
        this.listar();
        //Lista todas las sucursales
        this.listarSucursales();
        //Autocompletado - Buscar por alias
        this.autocompletado.valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.servicio.listarPorAlias(data).subscribe(function (res) {
                    _this.formulario.patchValue(res.json());
                });
            }
        });
        //Autcompletado - Buscar por Remitente
        this.formulario.get('cliente').valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.clienteService.listarPorAlias(data).subscribe(function (res) {
                    _this.resultadosClientes = res;
                });
            }
        });
        //Autcompletado - Buscar por Localidad
        this.formulario.get('localidad').valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.localidadService.listarPorNombre(data).subscribe(function (res) {
                    _this.resultadosLocalidades = res;
                });
            }
        });
        //Autcompletado - Buscar por Barrio
        this.formulario.get('barrio').valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.barrioService.listarPorNombre(data).subscribe(function (res) {
                    _this.resultadosBarrios = res;
                });
            }
        });
    };
    //Obtiene el listado de registros
    OrdenRecoleccionComponent.prototype.listar = function () {
        var _this = this;
        this.servicio.listar().subscribe(function (res) {
            _this.listaCompleta = res.json();
        }, function (err) {
        });
    };
    //Obtiene el listado de Sucursales
    OrdenRecoleccionComponent.prototype.listarSucursales = function () {
        var _this = this;
        this.sucursalService.listar().subscribe(function (res) {
            _this.resultadosSucursales = res.json();
        }, function (err) {
        });
    };
    //Controla el cambio del autocompletado para el Remitente
    OrdenRecoleccionComponent.prototype.cambioRemitente = function () {
        this.mostrarCliente = true;
        var domicilioYBarrio = this.formulario.get('cliente').value.domicilio + ' - ' + this.formulario.get('cliente').value.barrio.nombre;
        var localidadYProvincia = this.formulario.get('cliente').value.localidad.nombre + ' - ' + this.formulario.get('cliente').value.localidad.provincia.nombre;
        this.domicilioBarrio.setValue(domicilioYBarrio);
        this.localidadProvincia.setValue(localidadYProvincia);
        // console.log(this.formulario.get('cliente').value.localidad);
        // console.log(this.formulario.get('cliente').value.barrio);
        this.formulario.get('localidad').setValue(this.formulario.get('cliente').value.localidad);
        this.formulario.get('barrio').setValue(this.formulario.get('cliente').value.barrio);
        this.formulario.get('domicilio').setValue(this.formulario.get('cliente').value.domicilio);
        // console.log(this.formulario.get('barrio').value)
    };
    //Funcion para establecer los valores de las pestañas
    OrdenRecoleccionComponent.prototype.establecerValoresPestania = function (nombrePestania, autocompletado, soloLectura, boton, selectSoloLectura, componente) {
        this.pestaniaActual = nombrePestania;
        this.mostrarAutocompletado = autocompletado;
        this.soloLectura = soloLectura;
        this.mostrarBoton = boton;
        if (selectSoloLectura == true) {
            this.formulario.get('entregarEnDomicilio').disable();
            this.formulario.get('pagoEnOrigen').disable();
            this.formulario.get('sucursalDestino').disable();
            this.formulario.get('entregarEnDomicilio').disable();
            this.formulario.get('localidad').disable();
            this.formulario.get('barrio').disable();
            this.formulario.get('cliente').disable();
            setTimeout(function () {
                document.getElementById('btnAgregar').setAttribute("disabled", "disabled");
            }, 20);
        }
        else {
            this.formulario.get('entregarEnDomicilio').enable();
            this.formulario.get('pagoEnOrigen').enable();
            this.formulario.get('sucursalDestino').enable();
            this.formulario.get('entregarEnDomicilio').enable();
            this.formulario.get('localidad').enable();
            this.formulario.get('barrio').enable();
            this.formulario.get('cliente').enable();
            setTimeout(function () {
                document.getElementById('btnAgregar').removeAttribute("disabled");
            }, 20);
        }
        setTimeout(function () {
            document.getElementById(componente).focus();
        }, 20);
    };
    ;
    //Establece valores al seleccionar una pestania
    OrdenRecoleccionComponent.prototype.seleccionarPestania = function (id, nombre, opcion) {
        this.reestablecerFormulario(undefined);
        this.listar();
        this.indiceSeleccionado = id;
        this.activeLink = nombre;
        if (opcion == 0) {
            this.autocompletado.setValue(undefined);
            this.resultados = [];
        }
        switch (id) {
            case 1:
                this.establecerValoresPestania(nombre, false, false, true, false, 'idCliente');
                break;
            case 2:
                this.establecerValoresPestania(nombre, true, true, false, true, 'idAutocompletado');
                break;
            case 3:
                this.establecerValoresPestania(nombre, true, false, true, false, 'idAutocompletado');
                break;
            case 4:
                this.establecerValoresPestania(nombre, true, true, true, true, 'idAutocompletado');
                break;
            default:
                break;
        }
    };
    //Funcion para determina que accion se requiere (Agregar, Actualizar, Eliminar)
    OrdenRecoleccionComponent.prototype.accion = function (indice) {
        switch (indice) {
            case 1:
                this.agregar();
                break;
            case 3:
                this.actualizar();
                break;
            case 4:
                this.eliminar();
                break;
            default:
                break;
        }
    };
    //Agrega un registro
    OrdenRecoleccionComponent.prototype.agregar = function () {
        var _this = this;
        this.formulario.get('empresa').setValue(this.appComponent.getEmpresa());
        this.formulario.get('sucursal').setValue(this.appComponent.getUsuario().sucursal);
        this.formulario.get('usuario').setValue(this.appComponent.getUsuario());
        this.formulario.get('fechaEmision').setValue(this.formulario.get('fechaEmision').value + 'T00:00:00');
        this.servicio.agregar(this.formulario.value).subscribe(function (res) {
            var respuesta = res.json();
            if (respuesta.codigo == 201) {
                _this.reestablecerFormulario(respuesta.id);
                setTimeout(function () {
                    document.getElementById('idCliente').focus();
                }, 20);
                _this.toastr.success(respuesta.mensaje);
            }
        }, function (err) {
            var respuesta = err.json();
            document.getElementById("idCliente").focus();
            _this.toastr.error(respuesta.mensaje);
        });
    };
    //Actualiza un registro
    OrdenRecoleccionComponent.prototype.actualizar = function () {
        var _this = this;
        this.formulario.get('empresa').setValue(this.appComponent.getEmpresa());
        this.formulario.get('sucursal').setValue(this.appComponent.getUsuario().sucursal);
        this.formulario.get('usuario').setValue(this.appComponent.getUsuario());
        this.formulario.get('fechaEmision').setValue(this.formulario.get('fechaEmision').value + 'T00:00:00');
        console.log(this.formulario.value);
        this.servicio.actualizar(this.formulario.value).subscribe(function (res) {
            var respuesta = res.json();
            if (respuesta.codigo == 200) {
                _this.reestablecerFormulario(undefined);
                setTimeout(function () {
                    document.getElementById('idAutocompletado').focus();
                }, 20);
                _this.toastr.success(respuesta.mensaje);
            }
        }, function (err) {
            var respuesta = err.json();
            if (respuesta.codigo == 11002) {
                document.getElementById("idCliente").focus();
                _this.toastr.error(respuesta.mensaje);
            }
        });
    };
    //Elimina un registro
    OrdenRecoleccionComponent.prototype.eliminar = function () {
        console.log();
    };
    //Abre el dialogo para agregar un cliente eventual
    OrdenRecoleccionComponent.prototype.agregarClienteEventual = function () {
        var _this = this;
        var dialogRef = this.dialog.open(cliente_eventual_component_1.ClienteEventualComponent, {
            width: '1200px',
            data: {
                formulario: null,
                usuario: this.appComponent.getUsuario()
            }
        });
        dialogRef.afterClosed().subscribe(function (resultado) {
            _this.clienteServicio.obtenerPorId(resultado).subscribe(function (res) {
                var cliente = res.json();
                _this.formulario.get('cliente').setValue(cliente);
            });
        });
    };
    //Comprueba que la fecha de Recolección sea igual o mayor a la fecha actual 
    OrdenRecoleccionComponent.prototype.verificarFecha = function () {
        if (this.formulario.get('fecha').value < this.formulario.get('fechaEmision').value) {
            this.formulario.get('fecha').reset();
            this.toastr.error("La Fecha de recolección no puede ser menor a la fecha actual");
            setTimeout(function () {
                document.getElementById('idFecha').focus();
            }, 20);
        }
    };
    //Formatea el numero a x decimales
    OrdenRecoleccionComponent.prototype.setDecimales = function (valor, cantidad) {
        valor.target.value = this.appService.setDecimales(valor.target.value, cantidad);
    };
    //Reestablece el formulario
    OrdenRecoleccionComponent.prototype.reestablecerFormulario = function (id) {
        var _this = this;
        this.resultadosClientes = [];
        this.mostrarCliente = false;
        this.autocompletado.setValue(undefined);
        this.formulario.reset();
        this.domicilioBarrio.setValue(null);
        this.localidadProvincia.setValue(null);
        //Setea la fecha actual
        this.fechaServicio.obtenerFecha().subscribe(function (res) {
            _this.formulario.get('fechaEmision').setValue(res.json());
        });
        setTimeout(function () {
            document.getElementById('idCliente').focus();
        }, 20);
    };
    OrdenRecoleccionComponent.prototype.compararFn = function (a, b) {
        if (a != null && b != null) {
            return a.id === b.id;
        }
    };
    //Define como se muestra los datos en el autcompletado
    OrdenRecoleccionComponent.prototype.displayF = function (elemento) {
        if (elemento != undefined) {
            return elemento.alias ? elemento.alias : elemento;
        }
        else {
            return elemento;
        }
    };
    //Define como se muestra los datos en el autcompletado a
    OrdenRecoleccionComponent.prototype.displayFn = function (elemento) {
        if (elemento != undefined) {
            return elemento.nombre ? elemento.nombre : elemento;
        }
        else {
            return elemento;
        }
    };
    //Define como se muestra los datos en el autcompletado b
    OrdenRecoleccionComponent.prototype.displayFb = function (elemento) {
        if (elemento != undefined) {
            return elemento.nombre ? elemento.nombre + ', ' + elemento.provincia.nombre
                + ', ' + elemento.provincia.pais.nombre : elemento;
        }
        else {
            return elemento;
        }
    };
    //Define como se muestra los datos en el autcompletado c
    OrdenRecoleccionComponent.prototype.displayFc = function (elemento) {
        if (elemento != undefined) {
            return elemento ? elemento.domicilio + ' - ' + elemento.barrio : elemento;
        }
        else {
            return '';
        }
    };
    //Muestra en la pestania buscar el elemento seleccionado de listar
    OrdenRecoleccionComponent.prototype.activarConsultar = function (elemento) {
        this.seleccionarPestania(2, this.pestanias[1].nombre, 1);
        this.autocompletado.setValue(elemento);
        this.formulario.patchValue(elemento);
        var domicilioYBarrio = this.formulario.get('cliente').value.domicilio + ' - ' + this.formulario.get('cliente').value.barrio.nombre;
        var localidadYProvincia = this.formulario.get('cliente').value.localidad.nombre + ' - ' + this.formulario.get('cliente').value.localidad.provincia.nombre;
        this.domicilioBarrio.setValue(domicilioYBarrio);
        this.localidadProvincia.setValue(localidadYProvincia);
    };
    //Muestra en la pestania actualizar el elemento seleccionado de listar
    OrdenRecoleccionComponent.prototype.activarActualizar = function (elemento) {
        this.seleccionarPestania(3, this.pestanias[2].nombre, 1);
        this.autocompletado.setValue(elemento);
        this.formulario.patchValue(elemento);
        var domicilioYBarrio = this.formulario.get('cliente').value.domicilio + ' - ' + this.formulario.get('cliente').value.barrio.nombre;
        var localidadYProvincia = this.formulario.get('cliente').value.localidad.nombre + ' - ' + this.formulario.get('cliente').value.localidad.provincia.nombre;
        this.domicilioBarrio.setValue(domicilioYBarrio);
        this.localidadProvincia.setValue(localidadYProvincia);
    };
    //Maneja los evento al presionar una tacla (para pestanias y opciones)
    OrdenRecoleccionComponent.prototype.manejarEvento = function (keycode) {
        var indice = this.indiceSeleccionado;
        if (keycode == 113) {
            if (indice < this.pestanias.length) {
                this.seleccionarPestania(indice + 1, this.pestanias[indice].nombre, 0);
            }
            else {
                this.seleccionarPestania(1, this.pestanias[0].nombre, 0);
            }
        }
    };
    OrdenRecoleccionComponent = __decorate([
        core_1.Component({
            selector: 'app-orden-recoleccion',
            templateUrl: './orden-recoleccion.component.html',
            styleUrls: ['./orden-recoleccion.component.css']
        }),
        __metadata("design:paramtypes", [ordenRecoleccion_1.OrdenRecoleccion, subopcion_pestania_service_1.SubopcionPestaniaService, app_component_1.AppComponent,
            fecha_service_1.FechaService, localidad_service_1.LocalidadService, cliente_service_1.ClienteService, ngx_toastr_1.ToastrService,
            barrio_service_1.BarrioService, app_service_1.AppService, orden_recoleccion_service_1.OrdenRecoleccionService,
            sucursal_service_1.SucursalService, material_1.MatDialog, cliente_service_1.ClienteService])
    ], OrdenRecoleccionComponent);
    return OrdenRecoleccionComponent;
}());
exports.OrdenRecoleccionComponent = OrdenRecoleccionComponent;
//# sourceMappingURL=orden-recoleccion.component.js.map