import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViajeUnidadNegocioComponent } from './viaje-unidad-negocio.component';

describe('ViajeUnidadNegocioComponent', () => {
  let component: ViajeUnidadNegocioComponent;
  let fixture: ComponentFixture<ViajeUnidadNegocioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViajeUnidadNegocioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViajeUnidadNegocioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
