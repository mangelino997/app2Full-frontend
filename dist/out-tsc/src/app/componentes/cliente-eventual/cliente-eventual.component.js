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
var cliente_service_1 = require("../../servicios/cliente.service");
var sucursal_service_1 = require("../../servicios/sucursal.service");
var afip_condicion_iva_service_1 = require("../../servicios/afip-condicion-iva.service");
var tipo_documento_service_1 = require("../../servicios/tipo-documento.service");
var barrio_service_1 = require("../../servicios/barrio.service");
var localidad_service_1 = require("../../servicios/localidad.service");
var cobrador_service_1 = require("../../servicios/cobrador.service");
var zona_service_1 = require("../../servicios/zona.service");
var rubro_service_1 = require("../../servicios/rubro.service");
var ngx_toastr_1 = require("ngx-toastr");
var material_1 = require("@angular/material");
var clienteEventual_1 = require("src/app/modelos/clienteEventual");
var ClienteEventualComponent = /** @class */ (function () {
    //Constructor
    function ClienteEventualComponent(dialogRef, data, afipCondicionIvaServicio, tipoDocumentoServicio, barrioServicio, localidadServicio, cobradorServicio, zonaServicio, rubroServicio, sucursalServicio, clienteServicio, toastr, clienteEventual) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.afipCondicionIvaServicio = afipCondicionIvaServicio;
        this.tipoDocumentoServicio = tipoDocumentoServicio;
        this.barrioServicio = barrioServicio;
        this.localidadServicio = localidadServicio;
        this.cobradorServicio = cobradorServicio;
        this.zonaServicio = zonaServicio;
        this.rubroServicio = rubroServicio;
        this.sucursalServicio = sucursalServicio;
        this.clienteServicio = clienteServicio;
        this.toastr = toastr;
        this.clienteEventual = clienteEventual;
        //Define la lista de condiciones de iva
        this.condicionesIva = [];
        //Define la lista de tipos de documentos
        this.tiposDocumentos = [];
        //Define la lista de resultados de busqueda de barrio
        this.resultadosBarrios = [];
        //Define la lista de resultados de busqueda de barrio
        this.resultadosLocalidades = [];
        //Define la lista de resultados de busqueda de cobrador
        this.resultadosCobradores = [];
        //Define la lista de resultados de busqueda de zona
        this.resultadosZonas = [];
        //Define la lista de resultados de busqueda de rubro
        this.resultadosRubros = [];
        //Define la lista de resultados de busqueda de sucursal lugar pago
        this.resultadosSucursalesPago = [];
        //Funcion para comparar y mostrar elemento de campo select
        this.compareFn = this.compararFn.bind(this);
        this.dialogRef.disableClose = true;
    }
    ClienteEventualComponent.prototype.ngOnInit = function () {
        var _this = this;
        //Define los campos para validaciones
        this.formulario = this.clienteEventual.formulario;
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
        //Autocompletado Cobrador - Buscar por nombre
        this.formulario.get('cobrador').valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.cobradorServicio.listarPorNombre(data).subscribe(function (response) {
                    _this.resultadosCobradores = response;
                });
            }
        });
        //Autocompletado Zona - Buscar por nombre
        this.formulario.get('zona').valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.zonaServicio.listarPorNombre(data).subscribe(function (response) {
                    _this.resultadosZonas = response;
                });
            }
        });
        //Autocompletado Rubro - Buscar por nombre
        this.formulario.get('rubro').valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.rubroServicio.listarPorNombre(data).subscribe(function (response) {
                    _this.resultadosRubros = response;
                });
            }
        });
        //Autocompletado Sucursal Lugar Pago - Buscar por nombre
        this.formulario.get('sucursalLugarPago').valueChanges.subscribe(function (data) {
            if (typeof data == 'string') {
                _this.sucursalServicio.listarPorNombre(data).subscribe(function (response) {
                    _this.resultadosSucursalesPago = response;
                });
            }
        });
        //Obtiene la lista de condiciones de iva
        this.listarCondicionesIva();
        //Obtiene la lista de tipos de documentos
        this.listarTiposDocumentos();
        //Obtiene el siguiente id
        this.obtenerSiguienteId();
        //Establece el foco en condicion de iva
        setTimeout(function () {
            document.getElementById('idCondicionIva').focus();
        }, 20);
    };
    //Obtiene el listado de condiciones de iva
    ClienteEventualComponent.prototype.listarCondicionesIva = function () {
        var _this = this;
        this.afipCondicionIvaServicio.listar().subscribe(function (res) {
            _this.condicionesIva = res.json();
        }, function (err) {
            console.log(err);
        });
    };
    //Obtiene el listado de tipos de documentos
    ClienteEventualComponent.prototype.listarTiposDocumentos = function () {
        var _this = this;
        this.tipoDocumentoServicio.listar().subscribe(function (res) {
            _this.tiposDocumentos = res.json();
        }, function (err) {
            console.log(err);
        });
    };
    ClienteEventualComponent.prototype.onNoClick = function () {
        console.log(this.data.formulario);
    };
    //  public cerrar(): void {
    //   //  this.data.formulario = this.formulario.value;
    //    console.log(this.data.formulario);
    //  }
    //Obtiene el siguiente id
    ClienteEventualComponent.prototype.obtenerSiguienteId = function () {
        var _this = this;
        this.clienteServicio.obtenerSiguienteId().subscribe(function (res) {
            _this.formulario.get('id').setValue(res.json());
        }, function (err) {
            console.log(err);
        });
    };
    //Agrega un cliente eventual
    ClienteEventualComponent.prototype.agregarClienteEventual = function () {
        var _this = this;
        this.formulario.get('usuarioAlta').setValue(this.data.usuario);
        this.clienteServicio.agregarClienteEventual(this.formulario.value).subscribe(function (res) {
            var respuesta = res.json();
            if (respuesta.codigo == 201) {
                _this.reestablecerFormulario(respuesta.id);
                setTimeout(function () {
                    document.getElementById('idCondicionIva').focus();
                }, 20);
                _this.data.formulario = respuesta.id - 1;
                console.log(_this.data.formulario);
                _this.toastr.success(respuesta.mensaje);
            }
        }, function (err) {
            _this.lanzarError(err);
        });
    };
    //Reestablece el formulario
    ClienteEventualComponent.prototype.reestablecerFormulario = function (id) {
        this.formulario.reset();
        this.formulario.get('id').setValue(id);
        this.vaciarListas();
    };
    //Vacia la lista de resultados de autocompletados
    ClienteEventualComponent.prototype.vaciarListas = function () {
        this.resultadosBarrios = [];
        this.resultadosLocalidades = [];
        this.resultadosCobradores = [];
        this.resultadosZonas = [];
        this.resultadosRubros = [];
        this.resultadosSucursalesPago = [];
    };
    //Manejo de colores de campos y labels
    ClienteEventualComponent.prototype.cambioCampo = function (id, label) {
        document.getElementById(id).classList.remove('is-invalid');
        document.getElementById(label).classList.remove('label-error');
    };
    //Lanza error desde el servidor (error interno, duplicidad de datos, etc.)
    ClienteEventualComponent.prototype.lanzarError = function (err) {
        var respuesta = err.json();
        if (respuesta.codigo == 11006) {
            document.getElementById("labelRazonSocial").classList.add('label-error');
            document.getElementById("idRazonSocial").classList.add('is-invalid');
            document.getElementById("idRazonSocial").focus();
        }
        else if (respuesta.codigo == 11009) {
            document.getElementById("labelTelefono").classList.add('label-error');
            document.getElementById("idTelefono").classList.add('is-invalid');
            document.getElementById("idTelefono").focus();
        }
        else if (respuesta.codigo == 11010) {
            document.getElementById("labelNumeroDocumento").classList.add('label-error');
            document.getElementById("idNumeroDocumento").classList.add('is-invalid');
            document.getElementById("idNumeroDocumento").focus();
        }
        this.toastr.error(respuesta.mensaje);
    };
    ClienteEventualComponent.prototype.compararFn = function (a, b) {
        if (a != null && b != null) {
            return a.id === b.id;
        }
    };
    //Define como se muestra los datos en el autcompletado a
    ClienteEventualComponent.prototype.displayFa = function (elemento) {
        if (elemento != undefined) {
            return elemento.nombre ? elemento.nombre : elemento;
        }
        else {
            return elemento;
        }
    };
    //Define como se muestra los datos en el autcompletado b
    ClienteEventualComponent.prototype.displayFb = function (elemento) {
        if (elemento != undefined) {
            return elemento.nombre ? elemento.nombre + ', ' + elemento.provincia.nombre
                + ', ' + elemento.provincia.pais.nombre : elemento;
        }
        else {
            return elemento;
        }
    };
    //Define como se muestra los datos en el autcompletado c
    ClienteEventualComponent.prototype.displayFc = function (elemento) {
        if (elemento != undefined) {
            return elemento.nombre ? elemento.nombre + ', ' + elemento.localidad.nombre : elemento;
        }
        else {
            return elemento;
        }
    };
    ClienteEventualComponent = __decorate([
        core_1.Component({
            selector: 'app-cliente-eventual',
            templateUrl: './cliente-eventual.component.html',
            styleUrls: ['./cliente-eventual.component.css']
        }),
        __param(1, core_1.Inject(material_1.MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [material_1.MatDialogRef, Object, afip_condicion_iva_service_1.AfipCondicionIvaService, tipo_documento_service_1.TipoDocumentoService,
            barrio_service_1.BarrioService, localidad_service_1.LocalidadService,
            cobrador_service_1.CobradorService, zona_service_1.ZonaService,
            rubro_service_1.RubroService, sucursal_service_1.SucursalService,
            cliente_service_1.ClienteService, ngx_toastr_1.ToastrService, clienteEventual_1.ClienteEventual])
    ], ClienteEventualComponent);
    return ClienteEventualComponent;
}());
exports.ClienteEventualComponent = ClienteEventualComponent;
//# sourceMappingURL=cliente-eventual.component.js.map