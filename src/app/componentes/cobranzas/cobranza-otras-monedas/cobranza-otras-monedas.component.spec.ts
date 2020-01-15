import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CobranzaOtrasMonedasComponent } from './cobranza-otras-monedas.component';

describe('CobranzaOtrasMonedasComponent', () => {
  let component: CobranzaOtrasMonedasComponent;
  let fixture: ComponentFixture<CobranzaOtrasMonedasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CobranzaOtrasMonedasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CobranzaOtrasMonedasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
