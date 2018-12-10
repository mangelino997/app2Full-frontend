import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CondicionVentaComponent } from './condicion-venta.component';

describe('CondicionVentaComponent', () => {
  let component: CondicionVentaComponent;
  let fixture: ComponentFixture<CondicionVentaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CondicionVentaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CondicionVentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
