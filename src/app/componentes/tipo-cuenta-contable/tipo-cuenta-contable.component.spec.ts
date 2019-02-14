import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoCuentaContableComponent } from './tipo-cuenta-contable.component';

describe('TipoCuentaContableComponent', () => {
  let component: TipoCuentaContableComponent;
  let fixture: ComponentFixture<TipoCuentaContableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipoCuentaContableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoCuentaContableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
