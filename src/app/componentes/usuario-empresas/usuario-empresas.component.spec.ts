import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioEmpresasComponent } from './usuario-empresas.component';

describe('UsuarioEmpresasComponent', () => {
  let component: UsuarioEmpresasComponent;
  let fixture: ComponentFixture<UsuarioEmpresasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsuarioEmpresasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuarioEmpresasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
