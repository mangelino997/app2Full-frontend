import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanillaCerradaComponent } from './planilla-cerrada.component';

describe('PlanillaCerradaComponent', () => {
  let component: PlanillaCerradaComponent;
  let fixture: ComponentFixture<PlanillaCerradaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanillaCerradaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanillaCerradaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
