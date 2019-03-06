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
var orden_venta_service_1 = require("../../servicios/orden-venta.service");
var subopcion_pestania_service_1 = require("../../servicios/subopcion-pestania.service");
var empresa_service_1 = require("../../servicios/empresa.service");
var cliente_service_1 = require("../../servicios/cliente.service");
var vendedor_service_1 = require("../../servicios/vendedor.service");
var tipo_tarifa_service_1 = require("../../servicios/tipo-tarifa.service");
var escala_tarifa_service_1 = require("../../servicios/escala-tarifa.service");
var tramo_service_1 = require("../../servicios/tramo.service");
var app_component_1 = require("../../app.component");
var forms_1 = require("@angular/forms");
var ngx_toastr_1 = require("ngx-toastr");
var app_service_1 = require("../../servicios/app.service");
var ordenVenta_1 = require("src/app/modelos/ordenVenta");
var ordenVentaEscala_1 = require("src/app/modelos/ordenVentaEscala");
var ordenVentaTramo_1 = require("src/app/modelos/ordenVentaTramo");
var OrdenVentaComponent = /** @class */ (function () {
    //Constructor
    function OrdenVentaComponent(servicio, subopcionPestaniaService, appComponent, toastr, formBuilder, empresaSevicio, clienteServicio, vendedorServicio, tipoTarifaServicio, escalaTarifaServicio, appService, tramoServicio, ordenVenta, ordenVentaServicio, ordenVentaEscala, ordenVentaTramo) {
        var _this = this;
        this.servicio = servicio;
        this.subopcionPestaniaService = subopcionPestaniaService;
        this.appComponent = appComponent;
        this.toastr = toastr;
        this.formBuilder = formBuilder;
        this.empresaSevicio = empresaSevicio;
        this.clienteServicio = clienteServicio;
        this.vendedorServicio = vendedorServicio;
        this.tipoTarifaServicio = tipoTarifaServicio;
        this.escalaTarifaServicio = escalaTarifaServicio;
        this.appService = appService;
        this.tramoServicio = tramoServicio;
        this.ordenVenta = ordenVenta;
        this.ordenVentaServicio = ordenVentaServicio;
        this.ordenVentaEscala = ordenVentaEscala;
        this.ordenVentaTramo = ordenVentaTramo;
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
        //Define una lista
        this.lista = null;
        //Define la lista para las Escalas agregadas
        this.listaDeEscalas = [];
        //Define la lista para los tramos agregados
        this.listaDeTramos = [];
        //Define la lista de pestanias
        this.pestanias = null;
        //Define el elemento de autocompletado
        this.elemAutocompletado = null;
        //Define el siguiente id
        this.siguienteId = null;
        //Define el id de la Escala que se quiere modificar
        this.idModEscala = null;
        //Define el id del Tramo que se quiere modificar
        this.idModTramo = null;
        //Define la lista completa de registros
        this.listaCompleta = null;
        //Define la lista de empresas
        this.empresas = null;
        //Define la lista de tipos de tarifas
        this.tiposTarifas = [];
        //Define la lista de tramos para la segunda tabla
        this.listaTramos = [];
        //Define el form control para las busquedas
        this.buscar = new forms_1.FormControl();
        //Define la lista de resultados de busqueda
        this.resultados = [];
        //Define el form control para las busquedas cliente
        this.buscarCliente = new forms_1.FormControl();
        //Define el form control para el precioDesde de cada registro
        this.precioDesde = new forms_1.FormControl();
        //Define la lista de resultados de busqueda cliente
        this.resultadosClientes = [];
        //Define el form control para las busquedas vendedor
        this.buscarVendedor = new forms_1.FormControl();
        //Define la lista de resultados de busqueda vendedor
        this.resultadosVendedores = [];
        //Define el form control para las busquedas tramo
        this.buscarTramo = new forms_1.FormControl();
        //Define el form control para el combo ordenes de venta
        this.ordenventa = new forms_1.FormControl();
        //Define la lista de ordenes de ventas
        this.ordenesVentas = [];
        //Define la lista de resultados de busqueda tramo
        this.resultadosTramos = [];
        //Define la lista de vendedores
        this.vendedores = [];
        //Define la lista de escalas
        this.escalas = [];
        //Funcion para comparar y mostrar elemento de campo select
        this.compareFn = this.compararFn.bind(this);
        //Obtiene la lista de pestania por rol y subopcion
        this.subopcionPestaniaService.listarPorRolSubopcion(this.appComponent.getRol(), this.appComponent.getSubopcion())
            .subscribe(function (res) {
            _this.pestanias = res.json();
            _this.activeLink = _this.pestanias[0].nombre;
        }, function (err) {
            console.log(err);
        });
        //Se subscribe al servicio de lista de registros
        this.servicio.listaCompleta.subscribe(function (res) {
            _this.listaCompleta = res;
        });
        //Autocompletado - Buscar por nombre
        this.buscar.valueChanges
            .subscribe(function (data) {
            if (typeof data == 'string') {
                _this.servicio.listarPorNombre(data).subscribe(function (response) {
                    _this.resultados = response;
                });
            }
        });
        //Autocompletado - Buscar por nombre cliente
        this.buscarCliente.valueChanges
            .subscribe(function (data) {
            if (typeof data == 'string') {
                _this.clienteServicio.listarPorAlias(data).subscribe(function (response) {
                    _this.resultadosClientes = response;
                });
            }
        });
    }
    //Al iniciarse el componente
    OrdenVentaComponent.prototype.ngOnInit = function () {
        var _this = this;
        //Obtiene la lista de empresas
        this.listarEmpresas();
        //Obtiene la lista de tipos de tarifas
        this.listarTiposTarifas();
        //Obtiene la lista de Vendedores
        this.listarVendedores();
        //Obtiene la lista de escalas tarifas
        this.listarEscalaTarifa();
        //Define el formulario de orden venta
        this.formulario = this.ordenVenta.formulario;
        //Define el formulario de orden venta escala
        this.formularioEscala = this.ordenVentaEscala.formulario;
        //Define el formulario de orden venta tramo
        this.formularioTramo = this.ordenVentaTramo.formulario;
        //Establece los valores por defecto
        this.establecerValoresPorDefecto();
        //Autocompletado Tramo - Buscar por nombre
        this.formularioTramo.get('tramo').valueChanges
            .subscribe(function (data) {
            if (typeof data == 'string') {
                _this.tramoServicio.listarPorOrigen(data).subscribe(function (response) {
                    _this.resultadosTramos = response;
                });
            }
        });
        //Establece los valores de la primera pestania activa
        this.seleccionarPestania(1, 'Agregar', 0);
    };
    //Establece los valores por defecto
    OrdenVentaComponent.prototype.establecerValoresPorDefecto = function () {
        this.formulario.get('tipoOrdenVenta').setValue(true);
        this.formulario.get('seguro').setValue('0.00');
        this.formulario.get('comisionCR').setValue('0.00');
    };
    //Obtiene la lista de empresas
    OrdenVentaComponent.prototype.listarEmpresas = function () {
        var _this = this;
        this.empresaSevicio.listar().subscribe(function (res) {
            _this.empresas = res.json();
        }, function (err) {
            console.log(err);
        });
    };
    //Obtiene la lista de tipos de tarifas
    OrdenVentaComponent.prototype.listarTiposTarifas = function () {
        var _this = this;
        this.tipoTarifaServicio.listar().subscribe(function (res) {
            _this.tiposTarifas = res.json();
            _this.formulario.get('tipoTarifa').setValue(_this.tiposTarifas[0]);
        }, function (err) {
            console.log(err);
        });
    };
    //Obtiene la lista de vendedores
    OrdenVentaComponent.prototype.listarVendedores = function () {
        var _this = this;
        this.vendedorServicio.listar().subscribe(function (response) {
            _this.vendedores = response.json();
        }, function (err) {
        });
    };
    //Obtiene una lista de escalas tarifas
    OrdenVentaComponent.prototype.listarEscalaTarifa = function () {
        var _this = this;
        this.escalaTarifaServicio.listar().subscribe(function (res) {
            _this.escalas = res.json();
        }, function (err) {
        });
    };
    //Listar ordenes de ventas por Empresa/Cliente
    OrdenVentaComponent.prototype.listarOrdenesVentas = function (tipo) {
        var _this = this;
        switch (tipo) {
            case 'empresa':
                this.ordenVentaServicio.listarPorEmpresa(this.formulario.get('empresa').value.id).subscribe(function (res) {
                    _this.ordenesVentas = res.json();
                });
                break;
            case 'cliente':
                this.formulario.get('cliente').setValue(this.buscarCliente.value);
                this.formulario.get('empresa').setValue(null);
                this.ordenVentaServicio.listarPorCliente(this.buscarCliente.value.id).subscribe(function (res) {
                    _this.ordenesVentas = res.json();
                });
                break;
        }
    };
    //Vacia la lista de resultados de autocompletados
    OrdenVentaComponent.prototype.vaciarLista = function () {
        this.resultados = [];
        this.resultadosClientes = [];
        this.resultadosVendedores = [];
        this.resultadosTramos = [];
    };
    //Cambio en elemento autocompletado
    OrdenVentaComponent.prototype.cambioAutocompletado = function (elemAutocompletado) {
    };
    //Funcion para establecer los valores de las pestañas
    OrdenVentaComponent.prototype.establecerValoresPestania = function (nombrePestania, autocompletado, soloLectura, boton, componente) {
        this.reestablecerCampos();
        this.pestaniaActual = nombrePestania;
        this.mostrarAutocompletado = autocompletado;
        this.soloLectura = soloLectura;
        this.mostrarBoton = boton;
        setTimeout(function () {
            document.getElementById(componente).focus();
        }, 20);
    };
    ;
    //Establece valores al seleccionar una pestania
    OrdenVentaComponent.prototype.seleccionarPestania = function (id, nombre, opcion) {
        this.indiceSeleccionado = id;
        this.activeLink = nombre;
        if (opcion == 0) {
            this.elemAutocompletado = null;
            this.resultados = [];
        }
        switch (id) {
            case 1:
                this.establecerCampos(1);
                this.establecerValoresPestania(nombre, false, false, true, 'idTipoOrdenVenta');
                break;
            case 2:
                this.establecerCampos(2);
                this.establecerValoresPestania(nombre, true, true, false, 'idTipoOrdenVenta');
                break;
            case 3:
                this.establecerCampos(3);
                this.establecerValoresPestania(nombre, true, false, true, 'idTipoOrdenVenta');
                break;
            case 4:
                this.establecerCampos(4);
                this.establecerValoresPestania(nombre, true, true, true, 'idTipoOrdenVenta');
                break;
            default:
                break;
        }
    };
    //Funcion para determina que accion se requiere (Agregar, Actualizar, Eliminar)
    OrdenVentaComponent.prototype.accion = function (indice) {
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
    //Establecer campos
    OrdenVentaComponent.prototype.establecerCampos = function (pestania) {
        switch (pestania) {
            case 1:
            case 3:
                this.formulario.get('tipoOrdenVenta').enable();
                this.formulario.get('empresa').enable();
                this.buscarCliente.enable();
                this.ordenventa.enable();
                this.formulario.get('vendedor').enable();
                this.formulario.get('tipoTarifa').enable();
                this.formularioEscala.enable();
                this.formularioTramo.enable();
                break;
            case 2:
            case 4:
                this.formulario.get('tipoOrdenVenta').enable();
                this.formulario.get('empresa').enable();
                this.buscarCliente.enable();
                this.ordenventa.enable();
                this.formulario.get('vendedor').disable();
                this.formulario.get('tipoTarifa').disable();
                this.formularioEscala.disable();
                this.formularioTramo.disable();
                break;
        }
        this.formulario.get('tipoTarifa').setValue(this.tiposTarifas[0]);
    };
    //Obtiene el listado de registros
    OrdenVentaComponent.prototype.listar = function () {
        var _this = this;
        this.servicio.listar().subscribe(function (res) {
            _this.listaCompleta = res.json();
        }, function (err) {
        });
    };
    //Controla el valor en los campos de Precio Fijo y Precio Unitario en TABLA ESCALA
    OrdenVentaComponent.prototype.controlPrecios = function (tipoPrecio) {
        switch (tipoPrecio) {
            case 1:
                if (this.formularioEscala.get('importeFijo').value > 0) {
                    this.formularioEscala.get('precioUnitario').setValue('0.00');
                }
                break;
            case 2:
                if (this.formularioEscala.get('precioUnitario').value > 0) {
                    this.formularioEscala.get('importeFijo').setValue('0.00');
                }
                break;
        }
    };
    //Agrega una Escala a listaDeEscalas
    OrdenVentaComponent.prototype.agregarEscalaLista = function () {
        this.formulario.disable();
        this.precioDesde.disable();
        if (this.idModEscala != null) {
            this.formularioEscala.get('preciosDesde').setValue(this.precioDesde.value);
            this.listaDeEscalas[this.idModEscala] = this.formularioEscala.value;
            this.formularioEscala.reset();
            this.idModEscala = null;
        }
        else {
            this.formularioEscala.get('preciosDesde').setValue(this.precioDesde.value);
            this.listaDeEscalas.push(this.formularioEscala.value);
            this.formularioEscala.reset();
        }
        setTimeout(function () {
            document.getElementById('idEscala').focus();
        }, 20);
    };
    //Elimina una Escala a listaDeEscalas
    OrdenVentaComponent.prototype.eliminarEscalaLista = function (indice) {
        this.listaDeEscalas.splice(indice, 1);
        if (this.listaDeEscalas.length == 0) {
            this.formulario.enable();
        }
    };
    //Modifica una Escala de listaDeEscalas
    OrdenVentaComponent.prototype.modificarEscalaLista = function (escala, indice) {
        this.formularioEscala.patchValue(escala);
        setTimeout(function () {
            document.getElementById('idEscala').focus();
        }, 20);
        this.idModEscala = indice;
    };
    //Controla el valor en los campos de Precio Fijo y Precio Unitario en TABLA TRAMO
    OrdenVentaComponent.prototype.controlPreciosTramo = function (tipoPrecio) {
        switch (tipoPrecio) {
            case 1:
                if (this.formularioTramo.get('importeFijoSeco').value > 0) {
                    this.formularioTramo.get('precioUnitarioSeco').setValue('0.00');
                }
                break;
            case 2:
                if (this.formularioTramo.get('precioUnitarioSeco').value > 0) {
                    this.formularioTramo.get('importeFijoSeco').setValue('0.00');
                }
                break;
        }
    };
    //Controla el valor en los campos de Precio Fijo y Precio Unitario en TABLA TRAMO
    OrdenVentaComponent.prototype.controlPreciosTramoRef = function (tipoPrecio) {
        switch (tipoPrecio) {
            case 1:
                if (this.formularioTramo.get('importeFijoRef').value > 0) {
                    this.formularioTramo.get('precioUnitarioRef').setValue('0.00');
                }
                break;
            case 2:
                if (this.formularioTramo.get('precioUnitarioRef').value > 0) {
                    this.formularioTramo.get('importeFijoRef').setValue('0.00');
                }
                break;
        }
    };
    //Agrega un Tramo a listaDeTramos
    OrdenVentaComponent.prototype.agregarTramoLista = function () {
        this.formulario.disable();
        this.precioDesde.disable();
        if (this.idModTramo != null) {
            this.formularioTramo.get('preciosDesde').setValue(this.precioDesde.value);
            this.listaDeTramos[this.idModTramo] = this.formularioTramo.value;
            this.formularioTramo.reset();
            this.idModTramo = null;
        }
        else {
            this.formularioTramo.get('preciosDesde').setValue(this.precioDesde.value);
            this.listaDeTramos.push(this.formularioTramo.value);
            this.formularioTramo.reset();
        }
        setTimeout(function () {
            document.getElementById('idTramo').focus();
        }, 20);
    };
    //Elimina un Tramo a listaDeTramos
    OrdenVentaComponent.prototype.eliminarTramoLista = function (indice) {
        this.listaDeTramos.splice(indice, 1);
        if (this.listaDeTramos.length == 0) {
            this.formulario.enable();
        }
    };
    //Modifica un Tramo de listaDeTramos
    OrdenVentaComponent.prototype.modificarTramoLista = function (tramo, indice) {
        this.formularioTramo.patchValue(tramo);
        setTimeout(function () {
            document.getElementById('idTramo').focus();
        }, 20);
        this.idModTramo = indice;
    };
    //Establece ceros a la derecha de los campos (decimales)
    OrdenVentaComponent.prototype.establecerCeros = function (campo) {
        campo.setValue(this.appComponent.establecerCeros(campo.value));
    };
    //Agrega un registro
    OrdenVentaComponent.prototype.agregar = function () {
        var _this = this;
        this.formulario.get('ordenesVentasEscalas').setValue(this.listaDeEscalas);
        this.formulario.get('ordenesVentasTramos').setValue(this.listaDeTramos);
        this.ordenVentaServicio.agregar(this.formulario.value).subscribe(function (res) {
            var respuesta = res.json();
            if (respuesta.codigo == 201) {
                _this.reestablecerCampos();
                setTimeout(function () {
                    document.getElementById('idNombre').focus();
                }, 20);
                _this.toastr.success(respuesta.mensaje);
            }
        }, function (err) {
            var respuesta = err.json();
            if (respuesta.codigo == 5001) {
                _this.toastr.warning(respuesta.mensaje, 'Registro agregado con éxito');
            }
            else {
                _this.toastr.error(respuesta.mensaje);
            }
        });
    };
    //Actualiza un registro
    OrdenVentaComponent.prototype.actualizar = function () {
        var _this = this;
        this.servicio.actualizar(this.formulario.value).subscribe(function (res) {
            var respuesta = res.json();
            if (respuesta.codigo == 200) {
                _this.formulario.reset();
                setTimeout(function () {
                    document.getElementById('idAutocompletado').focus();
                }, 20);
                _this.toastr.success(respuesta.mensaje);
            }
        }, function (err) {
            var respuesta = err.json();
            if (respuesta.codigo == 5001) {
                _this.toastr.warning(respuesta.mensaje, 'Registro actualizado con éxito');
            }
            else {
                _this.toastr.error(respuesta.mensaje);
            }
        });
    };
    //Carga los datos de la orden de venta seleccionada en los input
    OrdenVentaComponent.prototype.cargarDatosOrden = function () {
        this.formulario.patchValue(this.ordenventa.value);
        if (this.formulario.get('tipoTarifa').value.porEscala == true) {
            this.listaDeEscalas = this.ordenventa.value.ordenesVentasEscalas;
        }
        else {
            this.listaDeTramos = this.ordenventa.value.ordenesVentasTramos;
        }
        this.precioDesde.setValue(this.ordenventa.value.activaDesde);
    };
    //Reestablecer campos
    OrdenVentaComponent.prototype.reestablecerCampos = function () {
        this.formulario.reset();
        this.formularioEscala.reset();
        this.formularioTramo.reset();
        this.listaDeEscalas = [];
        this.listaDeTramos = [];
        this.precioDesde.setValue(null);
        this.formulario.get('tipoTarifa').setValue(this.tiposTarifas[0]);
    };
    //Elimina un registro
    OrdenVentaComponent.prototype.eliminar = function () {
    };
    //Manejo de colores de campos y labels
    OrdenVentaComponent.prototype.cambioCampo = function (id, label) {
        document.getElementById(id).classList.remove('is-invalid');
        document.getElementById(label).classList.remove('label-error');
    };
    //Manejo de cambio de autocompletado tramo
    OrdenVentaComponent.prototype.cambioAutocompletadoTramo = function () {
        this.formularioTramo.get('kmTramo').setValue(this.formularioTramo.get('tramo').value.km);
    };
    OrdenVentaComponent.prototype.cambioImporte = function (valor, elemento, i) {
    };
    //Formatea el numero a x decimales
    OrdenVentaComponent.prototype.setDecimales = function (valor, cantidad) {
        valor.target.value = this.appService.setDecimales(valor.target.value, cantidad);
    };
    OrdenVentaComponent.prototype.compararFn = function (a, b) {
        if (a != null && b != null) {
            return a.id === b.id;
        }
    };
    //Muestra el valor en los autocompletados
    OrdenVentaComponent.prototype.displayF = function (elemento) {
        if (elemento != undefined) {
            return elemento.alias ? elemento.alias : elemento;
        }
        else {
            return elemento;
        }
    };
    //Muestra el valor en los autocompletados a
    OrdenVentaComponent.prototype.displayFa = function (elemento) {
        if (elemento != undefined) {
            return elemento.razonSocial ? elemento.razonSocial : elemento;
        }
        else {
            return elemento;
        }
    };
    //Muestra el valor en los autocompletados b
    OrdenVentaComponent.prototype.displayFb = function (elemento) {
        if (elemento != undefined) {
            return elemento.nombre ? elemento.nombre : elemento;
        }
        else {
            return elemento;
        }
    };
    //Muestra el valor en los autocompletados c
    OrdenVentaComponent.prototype.displayFc = function (elemento) {
        if (elemento != undefined) {
            return elemento.origen ? elemento.origen.nombre + ' - ' + elemento.destino.nombre : elemento;
        }
        else {
            return elemento;
        }
    };
    OrdenVentaComponent = __decorate([
        core_1.Component({
            selector: 'app-orden-venta',
            templateUrl: './orden-venta.component.html',
            styleUrls: ['./orden-venta.component.css']
        }),
        __metadata("design:paramtypes", [orden_venta_service_1.OrdenVentaService, subopcion_pestania_service_1.SubopcionPestaniaService,
            app_component_1.AppComponent, ngx_toastr_1.ToastrService, forms_1.FormBuilder,
            empresa_service_1.EmpresaService, cliente_service_1.ClienteService,
            vendedor_service_1.VendedorService, tipo_tarifa_service_1.TipoTarifaService,
            escala_tarifa_service_1.EscalaTarifaService, app_service_1.AppService,
            tramo_service_1.TramoService, ordenVenta_1.OrdenVenta, orden_venta_service_1.OrdenVentaService,
            ordenVentaEscala_1.OrdenVentaEscala, ordenVentaTramo_1.OrdenVentaTramo])
    ], OrdenVentaComponent);
    return OrdenVentaComponent;
}());
exports.OrdenVentaComponent = OrdenVentaComponent;
//# sourceMappingURL=orden-venta.component.js.map