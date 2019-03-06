"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var moneda_cuenta_contable_component_1 = require("./moneda-cuenta-contable.component");
describe('MonedaCuentaContableComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [moneda_cuenta_contable_component_1.MonedaCuentaContableComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(moneda_cuenta_contable_component_1.MonedaCuentaContableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=moneda-cuenta-contable.component.spec.js.map