import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoParcialComponent } from './pago-parcial.component';

describe('PagoParcialComponent', () => {
  let component: PagoParcialComponent;
  let fixture: ComponentFixture<PagoParcialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagoParcialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagoParcialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
