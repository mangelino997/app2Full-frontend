import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrupoCuentaContableComponent } from './grupo-cuenta-contable.component';

describe('GrupoCuentaContableComponent', () => {
  let component: GrupoCuentaContableComponent;
  let fixture: ComponentFixture<GrupoCuentaContableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrupoCuentaContableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrupoCuentaContableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
