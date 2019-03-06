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
var vehiculo_service_1 = require("../../servicios/vehiculo.service");
var subopcion_pestania_service_1 = require("../../servicios/subopcion-pestania.service");
var tipo_vehiculo_service_1 = require("../../servicios/tipo-vehiculo.service");
var marca_vehiculo_service_1 = require("../../servicios/marca-vehiculo.service");
var localidad_service_1 = require("../../servicios/localidad.service");
var empresa_service_1 = require("../../servicios/empresa.service");
var compania_seguro_poliza_service_1 = require("../../servicios/compania-seguro-poliza.service");
var configuracion_vehiculo_service_1 = require("../../servicios/configuracion-vehiculo.service");
var personal_service_1 = require("../../servicios/personal.service");
var app_component_1 = require("../../app.component");
var forms_1 = require("@angular/forms");
var ngx_toastr_1 = require("ngx-toastr");
var vehiculo_1 = require("src/app/modelos/vehiculo");
var VehiculoComponent = /** @class */ (function () {
    //Constructor
    function VehiculoComponent(servicio, subopcionPestaniaService, appComponent, toastr, tipoVehiculoServicio, marcaVehiculoServicio, localidadServicio, empresaServicio, companiaSeguroPolizaServicio, configuracionVehiculoServicio, personalServicio, vehiculoModelo) {
        var _this = this;
        this.servicio = servicio;
        this.subopcionPestaniaService = subopcionPestaniaService;
        this.appComponent = appComponent;
        this.toastr = toastr;
        this.tipoVehiculoServicio = tipoVehiculoServicio;
        this.marcaVehiculoServicio = marcaVehiculoServicio;
        this.localidadServicio = localidadServicio;
        this.empresaServicio = empresaServicio;
        this.companiaSeguroPolizaServicio = companiaSeguroPolizaServicio;
        this.configuracionVehiculoServicio = configuracionVehiculoServicio;
        this.personalServicio = personalServicio;
        this.vehiculoModelo = vehiculoModelo;
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
        //Define si mostrar la lista de configuraciones de vehiculos
        this.mostrarConfiguracionVehiculo = null;
        //Define la lista de pestanias
        this.pestanias = [];
        //Define la lista completa de registros
        this.listaCompleta = [];
        //Define la lista de tipos de vehiculos
        this.tiposVehiculos = [];
        //Define la lista de marcas de vehiculos
        this.marcasVehiculos = [];
        //Define la lista de empresas
        this.empresas = [];
        //Define la lista de configuraciones de vehiculos
        this.configuracionesVehiculos = [];
        //Define el autocompletado para las busquedas
        this.autocompletado = new forms_1.FormControl();
        //Define un campo control para tipo vehiculo
        this.tipoVehiculo = new forms_1.FormControl();
        //Define un campo control para marca vehiculo
        this.marcaVehiculo = new forms_1.FormControl();
        //Define la lista de resultados de busqueda
        this.resultados = [];
        //Define la lista de resultados de busqueda vehiculo remolque
        this.resultadosVehiculosRemolques = [];
        //Define la lista de resultados de busqueda localidad
        this.resultadosLocalidades = [];
        //Define la lista de resultados de busqueda compania seguro
        this.resultadosCompaniasSegurosPolizas = [];
        //Define la lista de resultados de busqueda personal
        this.resultadosPersonales = [];
        //Define el campo de control configuracion
        this.configuracion = new forms_1.FormControl();
        //Defiene la lista de compania seguro poliza
        this.companiasSegurosPolizas = [];
        //Define el mostrado de datos y comparacion en campo select
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
        //Autocompletado - Buscar por alias
        this.autocompletado.valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.servicio.listarPorAlias(data).subscribe(function (response) {
                    _this.resultados = response;
                });
            }
        });
    }
    //Al iniciarse el componente
    VehiculoComponent.prototype.ngOnInit = function () {
        var _this = this;
        //Define los campos para validaciones
        this.formulario = this.vehiculoModelo.formulario;
        //Autocompletado - Buscar por alias filtro remolque
        this.formulario.get('vehiculoRemolque').valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.servicio.listarPorAliasFiltroRemolque(data).subscribe(function (response) {
                    _this.resultadosVehiculosRemolques = response;
                });
            }
        });
        //Autocompletado Localidad - Buscar por nombre
        this.formulario.get('localidad').valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.localidadServicio.listarPorNombre(data).subscribe(function (response) {
                    _this.resultadosLocalidades = response;
                });
            }
        });
        //Autocompletado Personal - Buscar chofer por alias
        this.formulario.get('personal').valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.personalServicio.listarChoferPorAlias(data).subscribe(function (response) {
                    _this.resultadosPersonales = response;
                });
            }
        });
        //Autocompletado Compania de Seguro - Buscar por nombre
        this.formulario.get('companiaSeguroPoliza').valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.companiaSeguroPolizaServicio.listarPorCompaniaSeguroNombre(data).subscribe(function (response) {
                    _this.resultadosCompaniasSegurosPolizas = response;
                });
            }
        });
        //Establece los valores de la primera pestania activa
        this.seleccionarPestania(1, 'Agregar', 0);
        //Obtiene la lista de tipos de vehiculos
        this.listarTiposVehiculos();
        //Obtiene la lista de marcas de vehiculos
        this.listarMarcasVehiculos();
        //Obtiene la lista de empresas
        this.listarEmpresas();
        //Obtiene la lista completa de registros
        this.listar();
    };
    //Obtiene la lista de tipos de vehiculos
    VehiculoComponent.prototype.listarTiposVehiculos = function () {
        var _this = this;
        this.tipoVehiculoServicio.listar().subscribe(function (res) {
            _this.tiposVehiculos = res.json();
        });
    };
    //Obtiene la lista de marcas de vehiculos
    VehiculoComponent.prototype.listarMarcasVehiculos = function () {
        var _this = this;
        this.marcaVehiculoServicio.listar().subscribe(function (res) {
            _this.marcasVehiculos = res.json();
        });
    };
    //Obtiene la lista de empresas
    VehiculoComponent.prototype.listarEmpresas = function () {
        var _this = this;
        this.empresaServicio.listar().subscribe(function (res) {
            _this.empresas = res.json();
        });
    };
    //Obtiene la lista de compania de seguros poliza por empresa
    VehiculoComponent.prototype.listarCompaniasSeguroPolizaPorEmpresa = function (empresa) {
        var _this = this;
        this.companiaSeguroPolizaServicio.listarPorEmpresa(empresa.id).subscribe(function (res) {
            _this.companiasSegurosPolizas = res.json();
        });
    };
    //Establece el formulario al seleccionar elemento de autocompletado
    VehiculoComponent.prototype.establecerFormulario = function (elemento) {
        this.formulario.setValue(elemento);
        this.tipoVehiculo.setValue(elemento.configuracionVehiculo.tipoVehiculo);
        this.marcaVehiculo.setValue(elemento.configuracionVehiculo.marcaVehiculo);
        this.establecerConfiguracion(elemento);
    };
    //Vacia la lista de resultados de autocompletados
    VehiculoComponent.prototype.vaciarLista = function () {
        this.resultados = [];
        this.resultadosVehiculosRemolques = [];
        this.resultadosLocalidades = [];
        this.resultadosCompaniasSegurosPolizas = [];
        this.resultadosPersonales = [];
    };
    //Funcion para establecer los valores de las pestañas
    VehiculoComponent.prototype.establecerValoresPestania = function (nombrePestania, autocompletado, soloLectura, boton, configuracionVehiculo, componente) {
        this.pestaniaActual = nombrePestania;
        this.mostrarAutocompletado = autocompletado;
        this.soloLectura = soloLectura;
        this.mostrarBoton = boton;
        this.mostrarConfiguracionVehiculo = configuracionVehiculo;
        this.tipoVehiculo.setValue(undefined);
        this.marcaVehiculo.setValue(undefined);
        this.configuracion.setValue(undefined);
        setTimeout(function () {
            document.getElementById(componente).focus();
        }, 20);
    };
    ;
    //Establece valores al seleccionar una pestania
    VehiculoComponent.prototype.seleccionarPestania = function (id, nombre, opcion) {
        this.reestablecerFormulario('');
        this.indiceSeleccionado = id;
        this.activeLink = nombre;
        if (opcion == 0) {
            this.autocompletado.setValue(undefined);
            this.resultados = [];
        }
        switch (id) {
            case 1:
                this.obtenerSiguienteId();
                this.establecerValoresPestania(nombre, false, false, true, true, 'idTipoVehiculo');
                break;
            case 2:
                this.establecerValoresPestania(nombre, true, true, false, false, 'idAutocompletado');
                break;
            case 3:
                this.establecerValoresPestania(nombre, true, false, true, true, 'idAutocompletado');
                break;
            case 4:
                this.establecerValoresPestania(nombre, true, true, true, false, 'idAutocompletado');
                break;
            default:
                break;
        }
    };
    //Funcion para determina que accion se requiere (Agregar, Actualizar, Eliminar)
    VehiculoComponent.prototype.accion = function (indice) {
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
    //Obtiene el siguiente id
    VehiculoComponent.prototype.obtenerSiguienteId = function () {
        var _this = this;
        this.servicio.obtenerSiguienteId().subscribe(function (res) {
            _this.formulario.get('id').setValue(res.json());
        }, function (err) {
            console.log(err);
        });
    };
    //Obtiene el listado de registros
    VehiculoComponent.prototype.listar = function () {
        var _this = this;
        this.servicio.listar().subscribe(function (res) {
            _this.listaCompleta = res.json();
        }, function (err) {
            console.log(err);
        });
    };
    //Obtiene la lista de configuraciones de vehiculos por tipoVehiculo y marcaVehiculo
    VehiculoComponent.prototype.listarConfiguracionesPorTipoVehiculoMarcaVehiculo = function () {
        var _this = this;
        var tipoVehiculo = this.tipoVehiculo.value;
        var marcaVehiculo = this.marcaVehiculo.value;
        if (tipoVehiculo != null && marcaVehiculo != null) {
            this.configuracionVehiculoServicio.listarPorTipoVehiculoMarcaVehiculo(tipoVehiculo.id, marcaVehiculo.id)
                .subscribe(function (res) {
                _this.configuracionesVehiculos = res.json();
            }, function (err) {
                console.log(err);
            });
        }
    };
    //Agrega un registro
    VehiculoComponent.prototype.agregar = function () {
        var _this = this;
        this.formulario.get('empresa').setValue(this.appComponent.getEmpresa());
        this.formulario.get('usuarioAlta').setValue(this.appComponent.getUsuario());
        this.servicio.agregar(this.formulario.value).subscribe(function (res) {
            var respuesta = res.json();
            if (respuesta.codigo == 201) {
                _this.reestablecerFormulario(respuesta.id);
                setTimeout(function () {
                    document.getElementById('idTipoVehiculo').focus();
                }, 20);
                _this.toastr.success(respuesta.mensaje);
            }
        }, function (err) {
            var respuesta = err.json();
            if (respuesta.codigo == 11017) {
                document.getElementById("labelDominio").classList.add('label-error');
                document.getElementById("idDominio").classList.add('is-invalid');
                document.getElementById("idDominio").focus();
            }
            else if (respuesta.codigo == 11018) {
                document.getElementById("labelNumeroInterno").classList.add('label-error');
                document.getElementById("idNumeroInterno").classList.add('is-invalid');
                document.getElementById("idNumeroInterno").focus();
            }
            _this.toastr.error(respuesta.mensaje);
        });
    };
    //Actualiza un registro
    VehiculoComponent.prototype.actualizar = function () {
        var _this = this;
        this.formulario.get('empresa').setValue(this.appComponent.getEmpresa());
        this.formulario.get('usuarioMod').setValue(this.appComponent.getUsuario());
        this.servicio.actualizar(this.formulario.value).subscribe(function (res) {
            var respuesta = res.json();
            if (respuesta.codigo == 200) {
                _this.reestablecerFormulario('');
                setTimeout(function () {
                    document.getElementById('idAutocompletado').focus();
                }, 20);
                _this.toastr.success(respuesta.mensaje);
            }
        }, function (err) {
            var respuesta = err.json();
            if (respuesta.codigo == 11017) {
                document.getElementById("labelDominio").classList.add('label-error');
                document.getElementById("idDominio").classList.add('is-invalid');
                document.getElementById("idDominio").focus();
            }
            else if (respuesta.codigo == 11018) {
                document.getElementById("labelNumeroInterno").classList.add('label-error');
                document.getElementById("idNumeroInterno").classList.add('is-invalid');
                document.getElementById("idNumeroInterno").focus();
            }
            _this.toastr.error(respuesta.mensaje);
        });
    };
    //Elimina un registro
    VehiculoComponent.prototype.eliminar = function () {
        console.log();
    };
    //Reestablece el formulario
    VehiculoComponent.prototype.reestablecerFormulario = function (id) {
        this.formulario.reset();
        this.formulario.get('id').setValue(id);
        this.autocompletado.setValue(undefined);
        this.tipoVehiculo.setValue(undefined);
        this.marcaVehiculo.setValue(undefined);
        this.vaciarLista();
    };
    /*
    * Establece la configuracion de vehiculo al seleccionar un item de la lista
    * configuraciones de vehiculos
    */
    VehiculoComponent.prototype.establecerConfiguracion = function (elemento) {
        this.configuracion.setValue('Modelo: ' + elemento.modelo +
            ' - Cantidad de Ejes: ' + elemento.cantidadEjes +
            ' - Capacidad de Carga: ' + elemento.capacidadCarga + '\n' +
            'Descripcion: ' + elemento.descripcion + '\n' +
            'Tara: ' + parseFloat(elemento.tara).toFixed(2) +
            ' - Altura: ' + parseFloat(elemento.altura).toFixed(2) +
            ' - Largo: ' + parseFloat(elemento.largo).toFixed(2) +
            ' - Ancho: ' + parseFloat(elemento.ancho).toFixed(2));
    };
    //Manejo de colores de campos y labels
    VehiculoComponent.prototype.cambioCampo = function (id, label) {
        document.getElementById(id).classList.remove('is-invalid');
        document.getElementById(label).classList.remove('label-error');
    };
    //Muestra en la pestania buscar el elemento seleccionado de listar
    VehiculoComponent.prototype.activarConsultar = function (elemento) {
        this.seleccionarPestania(2, this.pestanias[1].nombre, 1);
        this.estableberValoresFormulario(elemento);
    };
    //Muestra en la pestania actualizar el elemento seleccionado de listar
    VehiculoComponent.prototype.activarActualizar = function (elemento) {
        this.seleccionarPestania(3, this.pestanias[2].nombre, 1);
        this.estableberValoresFormulario(elemento);
    };
    //Establece los valores al "ver" o "modificar" desde la pestaña "lista"
    VehiculoComponent.prototype.estableberValoresFormulario = function (elemento) {
        this.autocompletado.setValue(elemento);
        this.formulario.setValue(elemento);
        this.tipoVehiculo.setValue(elemento.configuracionVehiculo.tipoVehiculo);
        this.marcaVehiculo.setValue(elemento.configuracionVehiculo.marcaVehiculo);
        this.establecerConfiguracion(elemento);
    };
    VehiculoComponent.prototype.compararFn = function (a, b) {
        if (a != null && b != null) {
            return a.id === b.id;
        }
    };
    //Muestra el valor en los autocompletados
    VehiculoComponent.prototype.displayF = function (elemento) {
        if (elemento != undefined) {
            return elemento.alias ? elemento.alias : elemento;
        }
        else {
            return elemento;
        }
    };
    //Muestra el valor en los autocompletados a
    VehiculoComponent.prototype.displayFa = function (elemento) {
        if (elemento != undefined) {
            return elemento.nombre ? elemento.nombre : elemento;
        }
        else {
            return elemento;
        }
    };
    //Muestra el valor de otro autocompletado b
    VehiculoComponent.prototype.displayFb = function (elemento) {
        if (elemento != undefined) {
            return elemento.nombre ? elemento.nombre + ', ' + elemento.provincia.nombre : elemento;
        }
        else {
            return elemento;
        }
    };
    //Muestra el valor en los autocompletados c
    VehiculoComponent.prototype.displayFc = function (elemento) {
        if (elemento != undefined) {
            return elemento.modelo ? 'Modelo: ' + elemento.modelo + ' - Cantidad Ejes: ' + elemento.cantidadEjes +
                ' - Capacidad Carga: ' + elemento.capacidadCarga : elemento;
        }
        else {
            return elemento;
        }
    };
    //Muestra el valor en los autocompletados d
    VehiculoComponent.prototype.displayFd = function (elemento) {
        if (elemento != undefined) {
            return elemento.razonSocial ? elemento.razonSocial : elemento;
        }
        else {
            return elemento;
        }
    };
    //Muestra el valor en los autocompletados e
    VehiculoComponent.prototype.displayFe = function (elemento) {
        if (elemento != undefined) {
            return elemento.companiaSeguro ? elemento.companiaSeguro.nombre + ' - Empresa: ' + elemento.empresa.razonSocial +
                ' - N° Póliza: ' + elemento.numeroPoliza + ' - Vto. Póliza: ' + elemento.vtoPoliza : elemento;
        }
        else {
            return elemento;
        }
    };
    //Maneja los evento al presionar una tacla (para pestanias y opciones)
    VehiculoComponent.prototype.manejarEvento = function (keycode) {
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
    VehiculoComponent = __decorate([
        core_1.Component({
            selector: 'app-vehiculo',
            templateUrl: './vehiculo.component.html',
            styleUrls: ['./vehiculo.component.css']
        }),
        __metadata("design:paramtypes", [vehiculo_service_1.VehiculoService, subopcion_pestania_service_1.SubopcionPestaniaService,
            app_component_1.AppComponent, ngx_toastr_1.ToastrService,
            tipo_vehiculo_service_1.TipoVehiculoService, marca_vehiculo_service_1.MarcaVehiculoService,
            localidad_service_1.LocalidadService, empresa_service_1.EmpresaService,
            compania_seguro_poliza_service_1.CompaniaSeguroPolizaService,
            configuracion_vehiculo_service_1.ConfiguracionVehiculoService,
            personal_service_1.PersonalService, vehiculo_1.Vehiculo])
    ], VehiculoComponent);
    return VehiculoComponent;
}());
exports.VehiculoComponent = VehiculoComponent;
//# sourceMappingURL=vehiculo.component.js.map