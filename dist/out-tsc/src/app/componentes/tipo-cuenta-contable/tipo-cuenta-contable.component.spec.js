"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var tipo_cuenta_contable_component_1 = require("./tipo-cuenta-contable.component");
describe('TipoCuentaContableComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [tipo_cuenta_contable_component_1.TipoCuentaContableComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(tipo_cuenta_contable_component_1.TipoCuentaContableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=tipo-cuenta-contable.component.spec.js.map