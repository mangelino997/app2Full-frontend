import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CobranzaOtrasCuentasComponent } from './cobranza-otras-cuentas.component';

describe('CobranzaOtrasCuentasComponent', () => {
  let component: CobranzaOtrasCuentasComponent;
  let fixture: ComponentFixture<CobranzaOtrasCuentasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CobranzaOtrasCuentasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CobranzaOtrasCuentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
