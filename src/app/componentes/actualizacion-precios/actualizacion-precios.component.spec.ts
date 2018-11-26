import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizacionPreciosComponent } from './actualizacion-precios.component';

describe('ActualizacionPreciosComponent', () => {
  let component: ActualizacionPreciosComponent;
  let fixture: ComponentFixture<ActualizacionPreciosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActualizacionPreciosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActualizacionPreciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
