import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GananciaNetaComponent } from './ganancia-neta.component';

describe('GananciaNetaComponent', () => {
  let component: GananciaNetaComponent;
  let fixture: ComponentFixture<GananciaNetaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GananciaNetaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GananciaNetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
