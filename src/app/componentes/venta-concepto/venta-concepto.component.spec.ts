import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentaConceptoComponent } from './venta-concepto.component';

describe('VentaConceptoComponent', () => {
  let component: VentaConceptoComponent;
  let fixture: ComponentFixture<VentaConceptoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentaConceptoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentaConceptoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
