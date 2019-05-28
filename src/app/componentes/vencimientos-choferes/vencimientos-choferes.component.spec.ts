import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VencimientosChoferesComponent } from './vencimientos-choferes.component';

describe('VencimientosChoferesComponent', () => {
  let component: VencimientosChoferesComponent;
  let fixture: ComponentFixture<VencimientosChoferesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VencimientosChoferesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VencimientosChoferesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
