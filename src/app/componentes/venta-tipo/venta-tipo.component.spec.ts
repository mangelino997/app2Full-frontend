import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentaTipoComponent } from './venta-tipo.component';

describe('VentaTipoComponent', () => {
  let component: VentaTipoComponent;
  let fixture: ComponentFixture<VentaTipoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentaTipoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentaTipoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
