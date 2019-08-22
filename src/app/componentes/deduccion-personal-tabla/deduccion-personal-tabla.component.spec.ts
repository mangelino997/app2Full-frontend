import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeduccionPersonalTablaComponent } from './deduccion-personal-tabla.component';

describe('DeduccionPersonalTablaComponent', () => {
  let component: DeduccionPersonalTablaComponent;
  let fixture: ComponentFixture<DeduccionPersonalTablaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeduccionPersonalTablaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeduccionPersonalTablaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
