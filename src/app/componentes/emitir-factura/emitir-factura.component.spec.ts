import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmitirFacturaComponent } from './emitir-factura.component';

describe('EmitirFacturaComponent', () => {
  let component: EmitirFacturaComponent;
  let fixture: ComponentFixture<EmitirFacturaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmitirFacturaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmitirFacturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
