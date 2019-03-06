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
var personal_service_1 = require("../../servicios/personal.service");
var subopcion_pestania_service_1 = require("../../servicios/subopcion-pestania.service");
var rol_opcion_service_1 = require("../../servicios/rol-opcion.service");
var barrio_service_1 = require("../../servicios/barrio.service");
var localidad_service_1 = require("../../servicios/localidad.service");
var sexo_service_1 = require("../../servicios/sexo.service");
var estado_civil_service_1 = require("../../servicios/estado-civil.service");
var tipo_documento_service_1 = require("../../servicios/tipo-documento.service");
var sucursal_service_1 = require("../../servicios/sucursal.service");
var area_service_1 = require("../../servicios/area.service");
var categoria_service_1 = require("../../servicios/categoria.service");
var sindicato_service_1 = require("../../servicios/sindicato.service");
var seguridad_social_service_1 = require("../../servicios/seguridad-social.service");
var obra_social_service_1 = require("../../servicios/obra-social.service");
var afip_actividad_service_1 = require("../../servicios/afip-actividad.service");
var afip_condicion_service_1 = require("../../servicios/afip-condicion.service");
var afip_localidad_service_1 = require("../../servicios/afip-localidad.service");
var afip_mod_contratacion_service_1 = require("../../servicios/afip-mod-contratacion.service");
var afip_siniestrado_service_1 = require("../../servicios/afip-siniestrado.service");
var afip_situacion_service_1 = require("../../servicios/afip-situacion.service");
var app_service_1 = require("../../servicios/app.service");
var app_component_1 = require("../../app.component");
var forms_1 = require("@angular/forms");
var ngx_toastr_1 = require("ngx-toastr");
var PersonalComponent = /** @class */ (function () {
    //Constructor
    function PersonalComponent(servicio, subopcionPestaniaService, appComponent, appServicio, toastr, rolOpcionServicio, barrioServicio, localidadServicio, sexoServicio, estadoCivilServicio, tipoDocumentoServicio, sucursalServicio, areaServicio, categoriaServicio, sindicatoServicio, seguridadSocialServicio, obraSocialServicio, afipActividadServicio, afipCondicionServicio, afipLocalidadServicio, afipModContratacionServicio, afipSiniestradoServicio, afipSituacionServicio) {
        var _this = this;
        this.servicio = servicio;
        this.subopcionPestaniaService = subopcionPestaniaService;
        this.appComponent = appComponent;
        this.appServicio = appServicio;
        this.toastr = toastr;
        this.rolOpcionServicio = rolOpcionServicio;
        this.barrioServicio = barrioServicio;
        this.localidadServicio = localidadServicio;
        this.sexoServicio = sexoServicio;
        this.estadoCivilServicio = estadoCivilServicio;
        this.tipoDocumentoServicio = tipoDocumentoServicio;
        this.sucursalServicio = sucursalServicio;
        this.areaServicio = areaServicio;
        this.categoriaServicio = categoriaServicio;
        this.sindicatoServicio = sindicatoServicio;
        this.seguridadSocialServicio = seguridadSocialServicio;
        this.obraSocialServicio = obraSocialServicio;
        this.afipActividadServicio = afipActividadServicio;
        this.afipCondicionServicio = afipCondicionServicio;
        this.afipLocalidadServicio = afipLocalidadServicio;
        this.afipModContratacionServicio = afipModContratacionServicio;
        this.afipSiniestradoServicio = afipSiniestradoServicio;
        this.afipSituacionServicio = afipSituacionServicio;
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
        //Define la lista de pestanias
        this.pestanias = [];
        //Define la lista de opciones
        this.opciones = [];
        //Define la lista completa de registros
        this.listaCompleta = [];
        //Define la opcion seleccionada
        this.opcionSeleccionada = null;
        //Define la lista de sexos
        this.sexos = [];
        //Define la lista de estados civiles
        this.estadosCiviles = [];
        //Define la lista de tipos de documentos
        this.tiposDocumentos = [];
        //Define la lista de sucursales
        this.sucursales = [];
        //Define la lista de areas
        this.areas = [];
        //Define la lista de sindicatos
        this.sindicatos = [];
        //Define la opcion activa
        this.botonOpcionActivo = null;
        //Define la nacionalidad de nacimiento
        this.nacionalidadNacimiento = new forms_1.FormControl();
        //Define el form control para las busquedas
        this.autocompletado = new forms_1.FormControl();
        //Define la lista de resultados de busqueda
        this.resultados = [];
        //Define la lista de resultados de busqueda de barrios
        this.resultadosBarrios = [];
        //Define la lista de resultados de busqueda de localidades
        this.resultadosLocalidades = [];
        //Define la lista de resultados de busqueda de categorias
        this.resultadosCategorias = [];
        //Define la lista de resultados de busqueda de seguridad social
        this.resultadosSeguridadesSociales = [];
        //Define la lista de resultados de busqueda de obra social
        this.resultadosObrasSociales = [];
        //Define la lista de resultados de busqueda de afip actividad
        this.resultadosAfipActividades = [];
        //Define la lista de resultados de busqueda de afip condicion
        this.resultadosAfipCondiciones = [];
        //Define la lista de resultados de busqueda de afip localidad
        this.resultadosAfipLocalidades = [];
        //Define la lista de resultados de busqueda de afip mod contratacion
        this.resultadosAfipModContrataciones = [];
        //Define la lista de resultados de busqueda de afip siniestrado
        this.resultadosAfipSiniestrados = [];
        //Define la lista de resultados de busqueda de afip situacion
        this.resultadosAfipSituaciones = [];
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
        //Obtiene la lista de opciones por rol y subopcion
        this.rolOpcionServicio.listarPorRolSubopcion(this.appComponent.getRol(), this.appComponent.getSubopcion())
            .subscribe(function (res) {
            _this.opciones = res.json();
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
    PersonalComponent.prototype.ngOnInit = function () {
        var _this = this;
        //Define los campos para validaciones
        this.formulario = new forms_1.FormGroup({
            id: new forms_1.FormControl(),
            version: new forms_1.FormControl(),
            nombre: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.maxLength(20)]),
            apellido: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.maxLength(20)]),
            nombreCompleto: new forms_1.FormControl('', [forms_1.Validators.maxLength(40)]),
            tipoDocumento: new forms_1.FormControl('', forms_1.Validators.required),
            numeroDocumento: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.min(1), forms_1.Validators.maxLength(11)]),
            cuil: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.min(1), forms_1.Validators.maxLength(11)]),
            empresa: new forms_1.FormControl(),
            barrio: new forms_1.FormControl(),
            localidad: new forms_1.FormControl('', forms_1.Validators.required),
            localidadNacimiento: new forms_1.FormControl('', forms_1.Validators.required),
            fechaNacimiento: new forms_1.FormControl('', forms_1.Validators.required),
            telefonoFijo: new forms_1.FormControl('', forms_1.Validators.maxLength(45)),
            telefonoMovil: new forms_1.FormControl('', forms_1.Validators.maxLength(45)),
            estadoCivil: new forms_1.FormControl('', forms_1.Validators.required),
            correoelectronico: new forms_1.FormControl('', forms_1.Validators.maxLength(30)),
            sexo: new forms_1.FormControl('', forms_1.Validators.required),
            sucursal: new forms_1.FormControl('', forms_1.Validators.required),
            area: new forms_1.FormControl('', forms_1.Validators.required),
            fechaInicio: new forms_1.FormControl('', forms_1.Validators.required),
            fechaFin: new forms_1.FormControl(),
            antiguedadAntAnio: new forms_1.FormControl('', [forms_1.Validators.min(1), forms_1.Validators.maxLength(5)]),
            antiguedadAntMes: new forms_1.FormControl('', [forms_1.Validators.min(1), forms_1.Validators.maxLength(5)]),
            domicilio: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.maxLength(60)]),
            esJubilado: new forms_1.FormControl(),
            esMensualizado: new forms_1.FormControl(),
            categoria: new forms_1.FormControl('', forms_1.Validators.required),
            obraSocial: new forms_1.FormControl('', forms_1.Validators.required),
            sindicato: new forms_1.FormControl('', forms_1.Validators.required),
            seguridadSocial: new forms_1.FormControl('', forms_1.Validators.required),
            afipSituacion: new forms_1.FormControl('', forms_1.Validators.required),
            afipCondicion: new forms_1.FormControl('', forms_1.Validators.required),
            afipActividad: new forms_1.FormControl('', forms_1.Validators.required),
            afipModContratacion: new forms_1.FormControl('', forms_1.Validators.required),
            afipLocalidad: new forms_1.FormControl('', forms_1.Validators.required),
            afipSiniestrado: new forms_1.FormControl('', forms_1.Validators.required),
            adherenteObraSocial: new forms_1.FormControl('', [forms_1.Validators.min(1), forms_1.Validators.maxLength(2)]),
            aporteAdicObraSocial: new forms_1.FormControl('', [forms_1.Validators.min(1), forms_1.Validators.maxLength(10)]),
            contribAdicObraSocial: new forms_1.FormControl('', [forms_1.Validators.min(1), forms_1.Validators.maxLength(10)]),
            aporteAdicSegSoc: new forms_1.FormControl('', [forms_1.Validators.min(1), forms_1.Validators.maxLength(4)]),
            aporteDifSegSoc: new forms_1.FormControl('', [forms_1.Validators.min(1), forms_1.Validators.maxLength(4)]),
            contribTareaDifSegSoc: new forms_1.FormControl('', [forms_1.Validators.min(1), forms_1.Validators.maxLength(4)]),
            enConvenioColectivo: new forms_1.FormControl('', forms_1.Validators.required),
            conCoberturaSCVO: new forms_1.FormControl('', forms_1.Validators.required),
            recibeAdelanto: new forms_1.FormControl('', forms_1.Validators.required),
            recibePrestamo: new forms_1.FormControl('', forms_1.Validators.required),
            cuotasPrestamo: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.min(1), forms_1.Validators.maxLength(2)]),
            usuarioAlta: new forms_1.FormControl(),
            usuarioBaja: new forms_1.FormControl(),
            usuarioMod: new forms_1.FormControl(),
            vtoLicenciaConducir: new forms_1.FormControl(),
            vtoCursoCNRT: new forms_1.FormControl(),
            vtoLNH: new forms_1.FormControl(),
            vtoLibretaSanidad: new forms_1.FormControl(),
            usuarioModLC: new forms_1.FormControl(),
            usuarioModCNRT: new forms_1.FormControl(),
            usuarioModLNH: new forms_1.FormControl(),
            usuarioModLS: new forms_1.FormControl(),
            fechaModLC: new forms_1.FormControl(),
            fechaModCNRT: new forms_1.FormControl(),
            fechaModLNH: new forms_1.FormControl(),
            fechaModLS: new forms_1.FormControl(),
            talleCamisa: new forms_1.FormControl('', forms_1.Validators.maxLength(20)),
            tallePantalon: new forms_1.FormControl('', forms_1.Validators.maxLength(20)),
            talleCalzado: new forms_1.FormControl('', forms_1.Validators.maxLength(20)),
            turnoMEntrada: new forms_1.FormControl(),
            turnoMSalida: new forms_1.FormControl(),
            turnoTEntrada: new forms_1.FormControl(),
            turnoTSalida: new forms_1.FormControl(),
            turnoNEntrada: new forms_1.FormControl(),
            turnoNSalida: new forms_1.FormControl(),
            turnoSEntrada: new forms_1.FormControl(),
            turnoSSalida: new forms_1.FormControl(),
            turnoDEntrada: new forms_1.FormControl(),
            turnoDSalida: new forms_1.FormControl(),
            turnoRotativo: new forms_1.FormControl(),
            turnoFueraConvenio: new forms_1.FormControl(),
            telefonoMovilEmpresa: new forms_1.FormControl('', forms_1.Validators.maxLength(45)),
            telefonoMovilFechaEntrega: new forms_1.FormControl(),
            telefonoMovilFechaDevolucion: new forms_1.FormControl(),
            telefonoMovilObservacion: new forms_1.FormControl('', forms_1.Validators.maxLength(100)),
            esChofer: new forms_1.FormControl('', forms_1.Validators.required),
            esChoferLargaDistancia: new forms_1.FormControl('', forms_1.Validators.required),
            esAcompReparto: new forms_1.FormControl('', forms_1.Validators.required),
            observaciones: new forms_1.FormControl('', forms_1.Validators.maxLength(200)),
            alias: new forms_1.FormControl('', forms_1.Validators.maxLength(100))
        });
        //Autocompletado Barrio - Buscar por nombre
        this.formulario.get('barrio').valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.barrioServicio.listarPorNombre(data).subscribe(function (response) {
                    _this.resultadosBarrios = response;
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
        //Autocompletado Localidad Nacimiento - Buscar por nombre
        this.formulario.get('localidadNacimiento').valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.localidadServicio.listarPorNombre(data).subscribe(function (response) {
                    _this.resultadosLocalidades = response;
                });
            }
        });
        //Autocompletado Categoria - Buscar por nombre
        this.formulario.get('categoria').valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.categoriaServicio.listarPorNombre(data).subscribe(function (response) {
                    _this.resultadosCategorias = response;
                });
            }
        });
        //Autocompletado Seguridad Social - Buscar por nombre
        this.formulario.get('seguridadSocial').valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.seguridadSocialServicio.listarPorNombre(data).subscribe(function (response) {
                    _this.resultadosSeguridadesSociales = response;
                });
            }
        });
        //Autocompletado Obra Social - Buscar por nombre
        this.formulario.get('obraSocial').valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.obraSocialServicio.listarPorNombre(data).subscribe(function (response) {
                    _this.resultadosObrasSociales = response;
                });
            }
        });
        //Autocompletado Afip Actividad - Buscar por nombre
        this.formulario.get('afipActividad').valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.afipActividadServicio.listarPorNombre(data).subscribe(function (response) {
                    _this.resultadosAfipActividades = response;
                });
            }
        });
        //Autocompletado Afip Condicion - Buscar por nombre
        this.formulario.get('afipCondicion').valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.afipCondicionServicio.listarPorNombre(data).subscribe(function (response) {
                    _this.resultadosAfipCondiciones = response;
                });
            }
        });
        //Autocompletado Afip Localidad - Buscar por nombre
        this.formulario.get('afipLocalidad').valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.afipLocalidadServicio.listarPorNombre(data).subscribe(function (response) {
                    _this.resultadosAfipLocalidades = response;
                });
            }
        });
        //Autocompletado Afip Mod Contratacion - Buscar por nombre
        this.formulario.get('afipModContratacion').valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.afipModContratacionServicio.listarPorNombre(data).subscribe(function (response) {
                    _this.resultadosAfipModContrataciones = response;
                });
            }
        });
        //Autocompletado Afip Siniestrado - Buscar por nombre
        this.formulario.get('afipSiniestrado').valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.afipSiniestradoServicio.listarPorNombre(data).subscribe(function (response) {
                    _this.resultadosAfipSiniestrados = response;
                });
            }
        });
        //Autocompletado Afip Situacion - Buscar por nombre
        this.formulario.get('afipSituacion').valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.afipSituacionServicio.listarPorNombre(data).subscribe(function (response) {
                    _this.resultadosAfipSituaciones = response;
                });
            }
        });
        //Establece los valores de la primera pestania activa
        this.seleccionarPestania(1, 'Agregar', 0);
        //Establece la primera opcion seleccionada
        this.seleccionarOpcion(15, 0);
        //Obtiene la lista completa de registros
        this.listar();
        //Obtiene la lista de sexos
        this.listarSexos();
        //Obtiene la lista de estados civiles
        this.listarEstadosCiviles();
        //Obtiene la lista de tipos de documentos
        this.listarTiposDocumentos();
        //Obtiene la lista de sucursales
        this.listarSucursales();
        //Obtiene la lista de areas
        this.listarAreas();
        //Obtiene la lista de sindicatos
        this.listarSindicatos();
        //Establece los valores por defecto
        this.establecerValoresPorDefecto();
    };
    //Establece los valores por defecto
    PersonalComponent.prototype.establecerValoresPorDefecto = function () {
        this.formulario.get('aporteAdicObraSocial').setValue('0.00');
        this.formulario.get('contribAdicObraSocial').setValue('0.00');
        this.formulario.get('aporteAdicSegSoc').setValue('0.00');
        this.formulario.get('aporteDifSegSoc').setValue('0.00');
        this.formulario.get('contribTareaDifSegSoc').setValue('0.00');
    };
    //Obtiene el listado de sexos
    PersonalComponent.prototype.listarSexos = function () {
        var _this = this;
        this.sexoServicio.listar().subscribe(function (res) {
            _this.sexos = res.json();
        }, function (err) {
            console.log(err);
        });
    };
    //Obtiene el listado de estados civiles
    PersonalComponent.prototype.listarEstadosCiviles = function () {
        var _this = this;
        this.estadoCivilServicio.listar().subscribe(function (res) {
            _this.estadosCiviles = res.json();
        }, function (err) {
            console.log(err);
        });
    };
    //Obtiene el listado de tipos de documentos
    PersonalComponent.prototype.listarTiposDocumentos = function () {
        var _this = this;
        this.tipoDocumentoServicio.listar().subscribe(function (res) {
            _this.tiposDocumentos = res.json();
        }, function (err) {
            console.log(err);
        });
    };
    //Obtiene el listado de sucursales
    PersonalComponent.prototype.listarSucursales = function () {
        var _this = this;
        this.sucursalServicio.listar().subscribe(function (res) {
            _this.sucursales = res.json();
        }, function (err) {
            console.log(err);
        });
    };
    //Obtiene el listado de areas
    PersonalComponent.prototype.listarAreas = function () {
        var _this = this;
        this.areaServicio.listar().subscribe(function (res) {
            _this.areas = res.json();
        }, function (err) {
            console.log(err);
        });
    };
    //Obtiene el listado de sindicatos
    PersonalComponent.prototype.listarSindicatos = function () {
        var _this = this;
        this.sindicatoServicio.listar().subscribe(function (res) {
            _this.sindicatos = res.json();
        }, function (err) {
            console.log(err);
        });
    };
    //Vacia la lista de resultados de autocompletados
    PersonalComponent.prototype.vaciarListas = function () {
        this.resultados = [];
        this.resultadosBarrios = [];
        this.resultadosLocalidades = [];
        this.resultadosCategorias = [];
        this.resultadosSeguridadesSociales = [];
        this.resultadosObrasSociales = [];
        this.resultadosAfipActividades = [];
        this.resultadosAfipCondiciones = [];
        this.resultadosAfipLocalidades = [];
        this.resultadosAfipModContrataciones = [];
        this.resultadosAfipSiniestrados = [];
        this.resultadosAfipSituaciones = [];
    };
    //Habilita o deshabilita los campos select dependiendo de la pestania actual
    PersonalComponent.prototype.establecerEstadoCampos = function (estado) {
        if (estado) {
            this.formulario.get('sexo').enabled;
            this.formulario.get('estadoCivil').enabled;
            this.formulario.get('tipoDocumento').enabled;
            this.formulario.get('sucursal').enabled;
            this.formulario.get('area').enabled;
            this.formulario.get('sindicato').enabled;
            this.formulario.get('esAcompReparto').enabled;
            this.formulario.get('enConvenioColectivo').enabled;
            this.formulario.get('conCoberturaSCVO').enabled;
            this.formulario.get('recibeAdelanto').enabled;
            this.formulario.get('recibePrestamo').enabled;
            this.formulario.get('esChofer').enabled;
            this.formulario.get('esChoferLargaDistancia').enabled;
            this.formulario.get('turnoRotativo').enabled;
            this.formulario.get('turnoFueraConvenio').enabled;
        }
        else {
            this.formulario.get('sexo').disabled;
            this.formulario.get('estadoCivil').disabled;
            this.formulario.get('tipoDocumento').disabled;
            this.formulario.get('sucursal').disabled;
            this.formulario.get('area').disabled;
            this.formulario.get('sindicato').disabled;
            this.formulario.get('esAcompReparto').disabled;
            this.formulario.get('enConvenioColectivo').disabled;
            this.formulario.get('conCoberturaSCVO').disabled;
            this.formulario.get('recibeAdelanto').disabled;
            this.formulario.get('recibePrestamo').disabled;
            this.formulario.get('esChofer').disabled;
            this.formulario.get('esChoferLargaDistancia').disabled;
            this.formulario.get('turnoRotativo').disabled;
            this.formulario.get('turnoFueraConvenio').disabled;
        }
    };
    //Cambio en elemento autocompletado
    PersonalComponent.prototype.cambioAutocompletado = function (elemAutocompletado) {
        this.formulario.setValue(elemAutocompletado);
        this.nacionalidadNacimiento.setValue(elemAutocompletado.localidadNacimiento.provincia.pais.nombre);
        this.formulario.get('fechaNacimiento').setValue(elemAutocompletado.fechaNacimiento.substring(0, 10));
        this.formulario.get('fechaInicio').setValue(elemAutocompletado.fechaInicio.substring(0, 10));
        if (elemAutocompletado.fechaFin != null) {
            this.formulario.get('fechaFin').setValue(elemAutocompletado.fechaFin.substring(0, 10));
        }
        if (elemAutocompletado.vtoLicenciaConducir != null) {
            this.formulario.get('vtoLicenciaConducir').setValue(elemAutocompletado.vtoLicenciaConducir.substring(0, 10));
        }
        if (elemAutocompletado.vtoCursoCNRT != null) {
            this.formulario.get('vtoCursoCNRT').setValue(elemAutocompletado.vtoCursoCNRT.substring(0, 10));
        }
        if (elemAutocompletado.vtoLNH != null) {
            this.formulario.get('vtoLNH').setValue(elemAutocompletado.vtoLNH.substring(0, 10));
        }
        if (elemAutocompletado.vtoLibretaSanidad != null) {
            this.formulario.get('vtoLibretaSanidad').setValue(elemAutocompletado.vtoLibretaSanidad.substring(0, 10));
        }
        if (elemAutocompletado.telefonoMovilFechaEntrega != null) {
            this.formulario.get('telefonoMovilFechaEntrega').setValue(elemAutocompletado.telefonoMovilFechaEntrega.substring(0, 10));
        }
        if (elemAutocompletado.telefonoMovilFechaDevolucion != null) {
            this.formulario.get('telefonoMovilFechaDevolucion').setValue(elemAutocompletado.telefonoMovilFechaDevolucion.substring(0, 10));
        }
    };
    //Funcion para establecer los valores de las pestañas
    PersonalComponent.prototype.establecerValoresPestania = function (nombrePestania, autocompletado, soloLectura, boton, componente) {
        this.pestaniaActual = nombrePestania;
        this.mostrarAutocompletado = autocompletado;
        this.soloLectura = soloLectura;
        this.mostrarBoton = boton;
        this.vaciarListas();
        setTimeout(function () {
            document.getElementById(componente).focus();
        }, 20);
    };
    //Establece valores al seleccionar una pestania
    PersonalComponent.prototype.seleccionarPestania = function (id, nombre, opcion) {
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
                this.establecerEstadoCampos(true);
                this.establecerValoresPestania(nombre, false, false, true, 'idApellido');
                break;
            case 2:
                this.establecerEstadoCampos(false);
                this.establecerValoresPestania(nombre, true, true, false, 'idAutocompletado');
                break;
            case 3:
                this.establecerEstadoCampos(true);
                this.establecerValoresPestania(nombre, true, false, true, 'idAutocompletado');
                break;
            case 4:
                this.establecerEstadoCampos(false);
                this.establecerValoresPestania(nombre, true, true, true, 'idAutocompletado');
                break;
            default:
                break;
        }
    };
    //Establece la opcion seleccionada
    PersonalComponent.prototype.seleccionarOpcion = function (opcion, indice) {
        this.opcionSeleccionada = opcion;
        this.botonOpcionActivo = indice;
        switch (opcion) {
            case 15:
                setTimeout(function () {
                    document.getElementById('idApellido').focus();
                }, 20);
                break;
            case 16:
                setTimeout(function () {
                    document.getElementById('idSucursal').focus();
                }, 20);
                break;
            case 17:
                setTimeout(function () {
                    document.getElementById('idCuil').focus();
                }, 20);
                break;
            case 18:
                setTimeout(function () {
                    document.getElementById('idRecibeAdelanto').focus();
                }, 20);
                break;
            case 19:
                setTimeout(function () {
                    document.getElementById('idEsChofer').focus();
                }, 20);
                break;
            case 20:
                setTimeout(function () {
                    document.getElementById('idTalleCamisa').focus();
                }, 20);
                break;
            case 21:
                setTimeout(function () {
                    document.getElementById('idCorreoelectronico').focus();
                }, 20);
                break;
        }
    };
    //Funcion para determina que accion se requiere (Agregar, Actualizar, Eliminar)
    PersonalComponent.prototype.accion = function (indice) {
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
    PersonalComponent.prototype.obtenerSiguienteId = function () {
        var _this = this;
        this.servicio.obtenerSiguienteId().subscribe(function (res) {
            _this.formulario.get('id').setValue(res.json());
        }, function (err) {
            console.log(err);
        });
    };
    //Obtiene el listado de registros
    PersonalComponent.prototype.listar = function () {
        var _this = this;
        this.servicio.listar().subscribe(function (res) {
            _this.listaCompleta = res.json();
        }, function (err) {
            console.log(err);
        });
    };
    //Agrega un registro
    PersonalComponent.prototype.agregar = function () {
        var _this = this;
        this.formulario.get('usuarioAlta').setValue(this.appComponent.getUsuario());
        this.formulario.get('empresa').setValue(this.appComponent.getEmpresa());
        this.formulario.get('esJubilado').setValue(false);
        this.formulario.get('esMensualizado').setValue(true);
        this.servicio.agregar(this.formulario.value).subscribe(function (res) {
            var respuesta = res.json();
            if (respuesta.codigo == 201) {
                _this.reestablecerFormulario(respuesta.id);
                setTimeout(function () {
                    document.getElementById('idApellido').focus();
                }, 20);
                _this.toastr.success(respuesta.mensaje);
            }
        }, function (err) {
            _this.lanzarError(err);
        });
    };
    //Actualiza un registro
    PersonalComponent.prototype.actualizar = function () {
        var _this = this;
        this.formulario.get('usuarioMod').setValue(this.appComponent.getUsuario());
        this.formulario.get('empresa').setValue(this.appComponent.getEmpresa());
        this.formulario.get('esJubilado').setValue(false);
        this.formulario.get('esMensualizado').setValue(true);
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
            _this.lanzarError(err);
        });
    };
    //Elimina un registro
    PersonalComponent.prototype.eliminar = function () {
        console.log();
    };
    //Reestablece los campos agregar
    PersonalComponent.prototype.reestablecerFormulario = function (id) {
        this.formulario.reset();
        this.formulario.get('id').setValue(id);
        this.autocompletado.setValue(undefined);
        this.nacionalidadNacimiento.setValue(undefined);
        this.vaciarListas();
    };
    //Lanza error desde el servidor (error interno, duplicidad de datos, etc.)
    PersonalComponent.prototype.lanzarError = function (err) {
        var respuesta = err.json();
        if (respuesta.codigo == 11010) {
            document.getElementById("labelNumeroDocumento").classList.add('label-error');
            document.getElementById("idNumeroDocumento").classList.add('is-invalid');
            document.getElementById("idNumeroDocumento").focus();
        }
        else if (respuesta.codigo == 11012) {
            document.getElementById("labelCuil").classList.add('label-error');
            document.getElementById("idCuil").classList.add('is-invalid');
            document.getElementById("idCuil").focus();
        }
        else if (respuesta.codigo == 11013) {
            document.getElementById("labelTelefonoFijo").classList.add('label-error');
            document.getElementById("idTelefonoFijo").classList.add('is-invalid');
            document.getElementById("idTelefonoFijo").focus();
        }
        else if (respuesta.codigo == 11014) {
            document.getElementById("labelTelefonoMovil").classList.add('label-error');
            document.getElementById("idTelefonoMovil").classList.add('is-invalid');
            document.getElementById("idTelefonoMovil").focus();
        }
        else if (respuesta.codigo == 11003) {
            document.getElementById("labelCorreoelectronico").classList.add('label-error');
            document.getElementById("idCorreoelectronico").classList.add('is-invalid');
            document.getElementById("idCorreoelectronico").focus();
        }
        else if (respuesta.codigo == 11015) {
            document.getElementById("labelTelefonoMovilEmpresa").classList.add('label-error');
            document.getElementById("idTelefonoMovilEmpresa").classList.add('is-invalid');
            document.getElementById("idTelefonoMovilEmpresa").focus();
        }
        this.toastr.error(respuesta.mensaje);
    };
    //Manejo de colores de campos y labels
    PersonalComponent.prototype.cambioCampo = function (id, label) {
        document.getElementById(id).classList.remove('is-invalid');
        document.getElementById(label).classList.remove('label-error');
    };
    //Formatea el numero a x decimales
    PersonalComponent.prototype.setDecimales = function (valor, cantidad) {
        valor.target.value = this.appServicio.setDecimales(valor.target.value, cantidad);
    };
    //Manejo de colores de campos y labels con patron erroneo
    PersonalComponent.prototype.validarPatron = function (patron, campo) {
        var valor = this.formulario.get(campo).value;
        if (valor != undefined && valor != null && valor != '') {
            var patronVerificador = new RegExp(patron);
            if (!patronVerificador.test(valor)) {
                if (campo == 'telefonoFijo') {
                    document.getElementById("labelTelefonoFijo").classList.add('label-error');
                    document.getElementById("idTelefonoFijo").classList.add('is-invalid');
                    this.toastr.error('Telefono Fijo incorrecto');
                }
                else if (campo == 'telefonoMovil') {
                    document.getElementById("labelTelefonoMovil").classList.add('label-error');
                    document.getElementById("idTelefonoMovil").classList.add('is-invalid');
                    this.toastr.error('Telefono Movil incorrecto');
                }
                else if (campo == 'telefonoMovilEmpresa') {
                    document.getElementById("labelTelefonoMovilEmpresa").classList.add('label-error');
                    document.getElementById("idTelefonoMovilEmpresa").classList.add('is-invalid');
                    this.toastr.error('Telefono Movil Empresa incorrecto');
                }
                else if (campo == 'correoelectronico') {
                    document.getElementById("labelCorreoelectronico").classList.add('label-error');
                    document.getElementById("idCorreoelectronico").classList.add('is-invalid');
                    this.toastr.error('Correo Electronico incorrecto');
                }
            }
        }
    };
    //Muestra en la pestania buscar el elemento seleccionado de listar
    PersonalComponent.prototype.activarConsultar = function (elemento) {
        this.seleccionarPestania(2, this.pestanias[1].nombre, 1);
        this.autocompletado.setValue(elemento);
        this.formulario.setValue(elemento);
        this.nacionalidadNacimiento.setValue(elemento.localidadNacimiento.provincia.pais.nombre);
    };
    //Muestra en la pestania actualizar el elemento seleccionado de listar
    PersonalComponent.prototype.activarActualizar = function (elemento) {
        this.seleccionarPestania(3, this.pestanias[2].nombre, 1);
        this.autocompletado.setValue(elemento);
        this.formulario.setValue(elemento);
        this.nacionalidadNacimiento.setValue(elemento.localidadNacimiento.provincia.pais.nombre);
    };
    //Establece la nacionalidad
    PersonalComponent.prototype.establecerNacionalidad = function (localidad) {
        this.nacionalidadNacimiento.setValue(localidad.provincia.pais.nombre);
    };
    PersonalComponent.prototype.compararFn = function (a, b) {
        if (a != null && b != null) {
            return a.id === b.id;
        }
    };
    //Define como se muestra los datos en el autcompletado
    PersonalComponent.prototype.displayF = function (elemento) {
        if (elemento != undefined) {
            return elemento.alias ? elemento.alias : elemento;
        }
        else {
            return elemento;
        }
    };
    //Define como se muestra los datos en el autcompletado a
    PersonalComponent.prototype.displayFa = function (elemento) {
        if (elemento != undefined) {
            return elemento.nombre ? elemento.nombre : elemento;
        }
        else {
            return elemento;
        }
    };
    //Define como se muestra los datos en el autcompletado b
    PersonalComponent.prototype.displayFb = function (elemento) {
        if (elemento != undefined) {
            return elemento.nombre ? elemento.nombre + ', ' + elemento.provincia.nombre
                + ', ' + elemento.provincia.pais.nombre : elemento;
        }
        else {
            return elemento;
        }
    };
    //Define como se muestra los datos en el autcompletado c
    PersonalComponent.prototype.displayFc = function (elemento) {
        if (elemento != undefined) {
            return elemento ? 'Si' : 'No';
        }
        else {
            return elemento;
        }
    };
    //Maneja los evento al presionar una tacla (para pestanias y opciones)
    PersonalComponent.prototype.manejarEvento = function (keycode) {
        var indice = this.indiceSeleccionado;
        var opcion = this.opcionSeleccionada;
        if (keycode == 113) {
            if (indice < this.pestanias.length) {
                this.seleccionarPestania(indice + 1, this.pestanias[indice].nombre, 0);
            }
            else {
                this.seleccionarPestania(1, this.pestanias[0].nombre, 0);
            }
        }
        else if (keycode == 115) {
            if (opcion < this.opciones[(this.opciones.length - 1)].id) {
                this.seleccionarOpcion(opcion + 1, opcion - 14);
            }
            else {
                this.seleccionarOpcion(15, 0);
            }
        }
    };
    PersonalComponent = __decorate([
        core_1.Component({
            selector: 'app-personal',
            templateUrl: './personal.component.html'
        }),
        __metadata("design:paramtypes", [personal_service_1.PersonalService, subopcion_pestania_service_1.SubopcionPestaniaService,
            app_component_1.AppComponent, app_service_1.AppService, ngx_toastr_1.ToastrService,
            rol_opcion_service_1.RolOpcionService, barrio_service_1.BarrioService,
            localidad_service_1.LocalidadService, sexo_service_1.SexoService,
            estado_civil_service_1.EstadoCivilService, tipo_documento_service_1.TipoDocumentoService,
            sucursal_service_1.SucursalService, area_service_1.AreaService,
            categoria_service_1.CategoriaService, sindicato_service_1.SindicatoService,
            seguridad_social_service_1.SeguridadSocialService, obra_social_service_1.ObraSocialService,
            afip_actividad_service_1.AfipActividadService, afip_condicion_service_1.AfipCondicionService,
            afip_localidad_service_1.AfipLocalidadService, afip_mod_contratacion_service_1.AfipModContratacionService,
            afip_siniestrado_service_1.AfipSiniestradoService, afip_situacion_service_1.AfipSituacionService])
    ], PersonalComponent);
    return PersonalComponent;
}());
exports.PersonalComponent = PersonalComponent;
//# sourceMappingURL=personal.component.js.map