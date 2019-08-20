import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeduccionGeneralComponent } from './deduccion-general.component';

describe('DeduccionGeneralComponent', () => {
  let component: DeduccionGeneralComponent;
  let fixture: ComponentFixture<DeduccionGeneralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeduccionGeneralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeduccionGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
