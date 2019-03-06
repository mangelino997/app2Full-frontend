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
var material_1 = require("@angular/material");
var usuario_empresa_service_1 = require("src/app/servicios/usuario-empresa.service");
var ngx_toastr_1 = require("ngx-toastr");
var UsuarioEmpresaComponent = /** @class */ (function () {
    //Constructor
    function UsuarioEmpresaComponent(dialog) {
        this.dialog = dialog;
    }
    UsuarioEmpresaComponent.prototype.ngOnInit = function () {
    };
    //Abre el dialogo
    UsuarioEmpresaComponent.prototype.openDialog = function () {
        var dialogRef = this.dialog.open(UsuarioEmpresaDialog, {
            width: '300px'
        });
    };
    UsuarioEmpresaComponent = __decorate([
        core_1.Component({
            selector: 'app-usuario-empresa',
            templateUrl: './usuario-empresa.component.html',
            styleUrls: ['./usuario-empresa.component.css']
        }),
        __metadata("design:paramtypes", [material_1.MatDialog])
    ], UsuarioEmpresaComponent);
    return UsuarioEmpresaComponent;
}());
exports.UsuarioEmpresaComponent = UsuarioEmpresaComponent;
var UsuarioEmpresaDialog = /** @class */ (function () {
    //Constructor
    function UsuarioEmpresaDialog(dialogRef, usuarioEmpresaServicio, toastr) {
        this.dialogRef = dialogRef;
        this.usuarioEmpresaServicio = usuarioEmpresaServicio;
        this.toastr = toastr;
        //Define la barra de progreso indeterminada
        this.progresoActivo = false;
    }
    //Reestablece la tabla al hacer click en aceptar
    UsuarioEmpresaDialog.prototype.aceptar = function () {
        var _this = this;
        this.progresoActivo = true;
        this.usuarioEmpresaServicio.reestablecerTablaDesdeCero().subscribe(function (res) {
            var respuesta = res.json();
            if (respuesta.codigo == 200) {
                _this.progresoActivo = false;
                _this.dialogRef.close();
                _this.toastr.success(respuesta.mensaje);
            }
        }, function (err) {
            var respuesta = err.json();
            _this.toastr.error(respuesta.mensaje);
        });
    };
    //Cierra el dialogo
    UsuarioEmpresaDialog.prototype.cancelar = function () {
        this.dialogRef.close();
    };
    UsuarioEmpresaDialog = __decorate([
        core_1.Component({
            selector: 'usuario-empresa-dialog',
            templateUrl: 'usuario-empresa-dialog.html',
        }),
        __metadata("design:paramtypes", [material_1.MatDialogRef,
            usuario_empresa_service_1.UsuarioEmpresaService,
            ngx_toastr_1.ToastrService])
    ], UsuarioEmpresaDialog);
    return UsuarioEmpresaDialog;
}());
exports.UsuarioEmpresaDialog = UsuarioEmpresaDialog;
//# sourceMappingURL=usuario-empresa.component.js.map