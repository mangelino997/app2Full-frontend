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
var subopcion_pestania_service_1 = require("src/app/servicios/subopcion-pestania.service");
var ngx_toastr_1 = require("ngx-toastr");
var SubopcionPestaniaComponent = /** @class */ (function () {
    //Constructor
    function SubopcionPestaniaComponent(dialog) {
        this.dialog = dialog;
    }
    SubopcionPestaniaComponent.prototype.ngOnInit = function () {
    };
    //Abre el dialogo
    SubopcionPestaniaComponent.prototype.openDialog = function () {
        var dialogRef = this.dialog.open(SubopcionPestaniaDialog, {
            width: '300px'
        });
    };
    SubopcionPestaniaComponent = __decorate([
        core_1.Component({
            selector: 'app-rol-subopcion',
            templateUrl: './subopcion-pestania.component.html',
            styleUrls: ['./subopcion-pestania.component.css']
        }),
        __metadata("design:paramtypes", [material_1.MatDialog])
    ], SubopcionPestaniaComponent);
    return SubopcionPestaniaComponent;
}());
exports.SubopcionPestaniaComponent = SubopcionPestaniaComponent;
var SubopcionPestaniaDialog = /** @class */ (function () {
    //Constructor
    function SubopcionPestaniaDialog(dialogRef, subopcionPestaniaServicio, toastr) {
        this.dialogRef = dialogRef;
        this.subopcionPestaniaServicio = subopcionPestaniaServicio;
        this.toastr = toastr;
        //Define la barra de progreso indeterminada
        this.progresoActivo = false;
    }
    //Reestablece la tabla al hacer click en aceptar
    SubopcionPestaniaDialog.prototype.aceptar = function () {
        var _this = this;
        this.progresoActivo = true;
        this.subopcionPestaniaServicio.reestablecerTablaDesdeCero().subscribe(function (res) {
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
    SubopcionPestaniaDialog.prototype.cancelar = function () {
        this.dialogRef.close();
    };
    SubopcionPestaniaDialog = __decorate([
        core_1.Component({
            selector: 'subopcion-pestania-dialog',
            templateUrl: 'subopcion-pestania-dialog.html',
        }),
        __metadata("design:paramtypes", [material_1.MatDialogRef,
            subopcion_pestania_service_1.SubopcionPestaniaService,
            ngx_toastr_1.ToastrService])
    ], SubopcionPestaniaDialog);
    return SubopcionPestaniaDialog;
}());
exports.SubopcionPestaniaDialog = SubopcionPestaniaDialog;
//# sourceMappingURL=subopcion-pestania.component.js.map