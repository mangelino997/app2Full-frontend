import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonedaCuentaContableComponent } from './moneda-cuenta-contable.component';

describe('MonedaCuentaContableComponent', () => {
  let component: MonedaCuentaContableComponent;
  let fixture: ComponentFixture<MonedaCuentaContableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonedaCuentaContableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonedaCuentaContableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
