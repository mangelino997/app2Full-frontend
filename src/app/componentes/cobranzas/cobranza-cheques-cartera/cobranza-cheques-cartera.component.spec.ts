import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CobranzaChequesCarteraComponent } from './cobranza-cheques-cartera.component';

describe('CobranzaChequesCarteraComponent', () => {
  let component: CobranzaChequesCarteraComponent;
  let fixture: ComponentFixture<CobranzaChequesCarteraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CobranzaChequesCarteraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CobranzaChequesCarteraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
