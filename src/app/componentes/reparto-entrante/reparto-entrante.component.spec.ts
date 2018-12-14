import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepartoEntranteComponent } from './reparto-entrante.component';

describe('RepartoEntranteComponent', () => {
  let component: RepartoEntranteComponent;
  let fixture: ComponentFixture<RepartoEntranteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepartoEntranteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepartoEntranteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
