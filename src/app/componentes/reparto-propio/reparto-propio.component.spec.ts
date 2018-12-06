import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepartoPropioComponent } from './reparto-propio.component';

describe('RepartoPropioComponent', () => {
  let component: RepartoPropioComponent;
  let fixture: ComponentFixture<RepartoPropioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepartoPropioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepartoPropioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
