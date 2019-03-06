"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var viaje_unidad_negocio_component_1 = require("./viaje-unidad-negocio.component");
describe('ViajeUnidadNegocioComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [viaje_unidad_negocio_component_1.ViajeUnidadNegocioComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(viaje_unidad_negocio_component_1.ViajeUnidadNegocioComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=viaje-unidad-negocio.component.spec.js.map