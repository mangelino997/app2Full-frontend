import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepartoComprobanteComponent } from './reparto-comprobante.component';

describe('RepartoComprobanteComponent', () => {
  let component: RepartoComprobanteComponent;
  let fixture: ComponentFixture<RepartoComprobanteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepartoComprobanteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepartoComprobanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
