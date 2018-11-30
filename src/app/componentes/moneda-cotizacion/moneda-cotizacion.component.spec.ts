import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonedaCotizacionComponent } from './moneda-cotizacion.component';

describe('MonedaCotizacionComponent', () => {
  let component: MonedaCotizacionComponent;
  let fixture: ComponentFixture<MonedaCotizacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonedaCotizacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonedaCotizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
