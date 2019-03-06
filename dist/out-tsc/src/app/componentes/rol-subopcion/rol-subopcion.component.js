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
var rol_subopcion_service_1 = require("src/app/servicios/rol-subopcion.service");
var ngx_toastr_1 = require("ngx-toastr");
var RolSubopcionComponent = /** @class */ (function () {
    //Constructor
    function RolSubopcionComponent(dialog) {
        this.dialog = dialog;
    }
    RolSubopcionComponent.prototype.ngOnInit = function () {
    };
    //Abre el dialogo
    RolSubopcionComponent.prototype.openDialog = function () {
        var dialogRef = this.dialog.open(RolSubopcionDialog, {
            width: '300px'
        });
    };
    RolSubopcionComponent = __decorate([
        core_1.Component({
            selector: 'app-rol-subopcion',
            templateUrl: './rol-subopcion.component.html',
            styleUrls: ['./rol-subopcion.component.css']
        }),
        __metadata("design:paramtypes", [material_1.MatDialog])
    ], RolSubopcionComponent);
    return RolSubopcionComponent;
}());
exports.RolSubopcionComponent = RolSubopcionComponent;
var RolSubopcionDialog = /** @class */ (function () {
    //Constructor
    function RolSubopcionDialog(dialogRef, rolSubopcionServicio, toastr) {
        this.dialogRef = dialogRef;
        this.rolSubopcionServicio = rolSubopcionServicio;
        this.toastr = toastr;
        //Define la barra de progreso indeterminada
        this.progresoActivo = false;
    }
    //Reestablece la tabla al hacer click en aceptar
    RolSubopcionDialog.prototype.aceptar = function () {
        var _this = this;
        this.progresoActivo = true;
        this.rolSubopcionServicio.reestablecerTablaDesdeCero().subscribe(function (res) {
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
    RolSubopcionDialog.prototype.cancelar = function () {
        this.dialogRef.close();
    };
    RolSubopcionDialog = __decorate([
        core_1.Component({
            selector: 'rol-subopcion-dialog',
            templateUrl: 'rol-subopcion-dialog.html',
        }),
        __metadata("design:paramtypes", [material_1.MatDialogRef,
            rol_subopcion_service_1.RolSubopcionService,
            ngx_toastr_1.ToastrService])
    ], RolSubopcionDialog);
    return RolSubopcionDialog;
}());
exports.RolSubopcionDialog = RolSubopcionDialog;
//# sourceMappingURL=rol-subopcion.component.js.map