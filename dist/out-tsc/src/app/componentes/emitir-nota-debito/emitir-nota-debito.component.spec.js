"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var emitir_nota_debito_component_1 = require("./emitir-nota-debito.component");
describe('EmitirNotaDebitoComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [emitir_nota_debito_component_1.EmitirNotaDebitoComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(emitir_nota_debito_component_1.EmitirNotaDebitoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=emitir-nota-debito.component.spec.js.map