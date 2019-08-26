import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturaDebitoCreditoComponent } from './factura-debito-credito.component';

describe('FacturaDebitoCreditoComponent', () => {
  let component: FacturaDebitoCreditoComponent;
  let fixture: ComponentFixture<FacturaDebitoCreditoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacturaDebitoCreditoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturaDebitoCreditoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
