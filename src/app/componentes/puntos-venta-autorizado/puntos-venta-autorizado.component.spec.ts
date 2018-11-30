import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PuntosVentaAutorizadoComponent } from './puntos-venta-autorizado.component';

describe('PuntosVentaAutorizadoComponent', () => {
  let component: PuntosVentaAutorizadoComponent;
  let fixture: ComponentFixture<PuntosVentaAutorizadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PuntosVentaAutorizadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PuntosVentaAutorizadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
