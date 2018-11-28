import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoServicioAfipComponent } from './estado-servicio-afip.component';

describe('EstadoServicioAfipComponent', () => {
  let component: EstadoServicioAfipComponent;
  let fixture: ComponentFixture<EstadoServicioAfipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstadoServicioAfipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadoServicioAfipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
