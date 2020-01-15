import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CobranzaChequesPropiosComponent } from './cobranza-cheques-propios.component';

describe('CobranzaChequesPropiosComponent', () => {
  let component: CobranzaChequesPropiosComponent;
  let fixture: ComponentFixture<CobranzaChequesPropiosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CobranzaChequesPropiosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CobranzaChequesPropiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
