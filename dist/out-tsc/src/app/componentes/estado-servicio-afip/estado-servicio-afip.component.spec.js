"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var estado_servicio_afip_component_1 = require("./estado-servicio-afip.component");
describe('EstadoServicioAfipComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [estado_servicio_afip_component_1.EstadoServicioAfipComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(estado_servicio_afip_component_1.EstadoServicioAfipComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=estado-servicio-afip.component.spec.js.map