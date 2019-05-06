import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorPuntoVentaComponent } from './error-punto-venta.component';

describe('ErrorPuntoVentaComponent', () => {
  let component: ErrorPuntoVentaComponent;
  let fixture: ComponentFixture<ErrorPuntoVentaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorPuntoVentaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorPuntoVentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
