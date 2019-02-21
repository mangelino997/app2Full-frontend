import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenRecoleccionComponent } from './orden-recoleccion.component';

describe('OrdenRecoleccionComponent', () => {
  let component: OrdenRecoleccionComponent;
  let fixture: ComponentFixture<OrdenRecoleccionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdenRecoleccionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdenRecoleccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
