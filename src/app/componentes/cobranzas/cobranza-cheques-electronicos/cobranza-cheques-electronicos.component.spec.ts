import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CobranzaChequesElectronicosComponent } from './cobranza-cheques-electronicos.component';

describe('CobranzaChequesElectronicosComponent', () => {
  let component: CobranzaChequesElectronicosComponent;
  let fixture: ComponentFixture<CobranzaChequesElectronicosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CobranzaChequesElectronicosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CobranzaChequesElectronicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
