import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeduccionPersonalComponent } from './deduccion-personal.component';

describe('DeduccionPersonalComponent', () => {
  let component: DeduccionPersonalComponent;
  let fixture: ComponentFixture<DeduccionPersonalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeduccionPersonalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeduccionPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
