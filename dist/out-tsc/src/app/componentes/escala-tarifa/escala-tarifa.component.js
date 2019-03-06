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
var escala_tarifa_service_1 = require("../../servicios/escala-tarifa.service");
var app_service_1 = require("../../servicios/app.service");
var app_component_1 = require("../../app.component");
var forms_1 = require("@angular/forms");
var ngx_toastr_1 = require("ngx-toastr");
var EscalaTarifaComponent = /** @class */ (function () {
    //Constructor
    function EscalaTarifaComponent(servicio, appComponent, toastr, appServicio) {
        var _this = this;
        this.servicio = servicio;
        this.appComponent = appComponent;
        this.toastr = toastr;
        this.appServicio = appServicio;
        //Define la lista completa de registros
        this.listaCompleta = [];
        //Se subscribe al servicio de lista de registros
        this.servicio.listaCompleta.subscribe(function (res) {
            _this.listaCompleta = res;
        });
        //Establece el foco en valor
        setTimeout(function () {
            document.getElementById('idValor').focus();
        }, 20);
    }
    //Al iniciarse el componente
    EscalaTarifaComponent.prototype.ngOnInit = function () {
        //Define los campos para validaciones
        this.formulario = new forms_1.FormGroup({
            id: new forms_1.FormControl(),
            version: new forms_1.FormControl(),
            valor: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.min(1), forms_1.Validators.maxLength(45)]),
            descripcion: new forms_1.FormControl()
        });
        //Obtiene la lista completa de registros
        this.listar();
        //Establece los valores por defecto
        this.establecerValoresPorDefecto();
    };
    //Establece los valores por defecto
    EscalaTarifaComponent.prototype.establecerValoresPorDefecto = function () {
        this.formulario.get('valor').setValue('0.00');
    };
    //Obtiene el listado de registros
    EscalaTarifaComponent.prototype.listar = function () {
        var _this = this;
        this.servicio.listar().subscribe(function (res) {
            _this.listaCompleta = res.json();
        }, function (err) {
            console.log(err);
        });
    };
    //Agrega un registro
    EscalaTarifaComponent.prototype.agregar = function () {
        var _this = this;
        this.servicio.agregar(this.formulario.value).subscribe(function (res) {
            var respuesta = res.json();
            if (respuesta.codigo == 201) {
                _this.reestablecerFormulario();
                setTimeout(function () {
                    document.getElementById('idValor').focus();
                }, 20);
                _this.toastr.success(respuesta.mensaje);
            }
        }, function (err) {
            var respuesta = err.json();
            if (respuesta.codigo == 11016) {
                document.getElementById("labelValor").classList.add('label-error');
                document.getElementById("idValor").classList.add('is-invalid');
                document.getElementById("idValor").focus();
            }
            _this.toastr.error(respuesta.mensaje);
        });
    };
    //Elimina un item de la lista
    EscalaTarifaComponent.prototype.eliminar = function (id) {
        var _this = this;
        this.servicio.eliminar(id).subscribe(function (res) {
            var respuesta = res.json();
            if (respuesta.codigo == 200) {
                _this.reestablecerFormulario();
                setTimeout(function () {
                    document.getElementById('idValor').focus();
                }, 20);
                _this.toastr.success(respuesta.mensaje);
            }
        }, function (err) {
            var respuesta = err.json();
            _this.toastr.error(respuesta.mensaje);
        });
    };
    //Reestablece el formulario
    EscalaTarifaComponent.prototype.reestablecerFormulario = function () {
        this.formulario.reset();
    };
    //Manejo de colores de campos y labels
    EscalaTarifaComponent.prototype.cambioCampo = function (id, label) {
        document.getElementById(id).classList.remove('is-invalid');
        document.getElementById(label).classList.remove('label-error');
    };
    //Establece el valor del campo descripcion al perder foco el campo valor
    EscalaTarifaComponent.prototype.establecerHasta = function (valor) {
        if (valor.target.value != undefined && valor.target.value != '') {
            this.formulario.get('descripcion').setValue('Hasta ' + valor.target.value);
        }
        else {
            this.formulario.get('descripcion').setValue(undefined);
        }
        valor.target.value = this.setDecimales(valor.target.value, 2);
    };
    //Formatea el numero a x decimales
    EscalaTarifaComponent.prototype.setDecimales = function (valor, cantidad) {
        return this.appServicio.setDecimales(valor, cantidad);
    };
    EscalaTarifaComponent = __decorate([
        core_1.Component({
            selector: 'app-escala-tarifa',
            templateUrl: './escala-tarifa.component.html',
            styleUrls: ['./escala-tarifa.component.css']
        }),
        __metadata("design:paramtypes", [escala_tarifa_service_1.EscalaTarifaService, app_component_1.AppComponent,
            ngx_toastr_1.ToastrService, app_service_1.AppService])
    ], EscalaTarifaComponent);
    return EscalaTarifaComponent;
}());
exports.EscalaTarifaComponent = EscalaTarifaComponent;
//# sourceMappingURL=escala-tarifa.component.js.map