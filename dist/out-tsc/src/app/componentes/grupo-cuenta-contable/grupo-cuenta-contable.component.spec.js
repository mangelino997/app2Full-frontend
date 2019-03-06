"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var grupo_cuenta_contable_component_1 = require("./grupo-cuenta-contable.component");
describe('GrupoCuentaContableComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [grupo_cuenta_contable_component_1.GrupoCuentaContableComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(grupo_cuenta_contable_component_1.GrupoCuentaContableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=grupo-cuenta-contable.component.spec.js.map