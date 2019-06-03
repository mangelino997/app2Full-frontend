import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoChequeraComponent } from './tipo-chequera.component';

describe('TipoChequeraComponent', () => {
  let component: TipoChequeraComponent;
  let fixture: ComponentFixture<TipoChequeraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipoChequeraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoChequeraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
