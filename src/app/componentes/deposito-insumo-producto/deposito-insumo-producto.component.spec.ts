import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositoInsumoProductoComponent } from './deposito-insumo-producto.component';

describe('DepositoInsumoProductoComponent', () => {
  let component: DepositoInsumoProductoComponent;
  let fixture: ComponentFixture<DepositoInsumoProductoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepositoInsumoProductoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositoInsumoProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
