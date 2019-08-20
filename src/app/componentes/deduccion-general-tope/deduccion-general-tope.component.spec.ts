import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeduccionGeneralTopeComponent } from './deduccion-general-tope.component';

describe('DeduccionGeneralTopeComponent', () => {
  let component: DeduccionGeneralTopeComponent;
  let fixture: ComponentFixture<DeduccionGeneralTopeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeduccionGeneralTopeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeduccionGeneralTopeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
