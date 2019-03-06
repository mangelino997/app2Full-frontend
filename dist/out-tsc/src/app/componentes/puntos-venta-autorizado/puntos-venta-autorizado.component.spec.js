"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var puntos_venta_autorizado_component_1 = require("./puntos-venta-autorizado.component");
describe('PuntosVentaAutorizadoComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [puntos_venta_autorizado_component_1.PuntosVentaAutorizadoComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(puntos_venta_autorizado_component_1.PuntosVentaAutorizadoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=puntos-venta-autorizado.component.spec.js.map