import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CobranzaTransferenciaBancariaComponent } from './cobranza-transferencia-bancaria.component';

describe('CobranzaTransferenciaBancariaComponent', () => {
  let component: CobranzaTransferenciaBancariaComponent;
  let fixture: ComponentFixture<CobranzaTransferenciaBancariaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CobranzaTransferenciaBancariaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CobranzaTransferenciaBancariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
