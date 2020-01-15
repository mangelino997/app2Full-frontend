import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CobranzaEfectivoComponent } from './cobranza-efectivo.component';

describe('CobranzaEfectivoComponent', () => {
  let component: CobranzaEfectivoComponent;
  let fixture: ComponentFixture<CobranzaEfectivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CobranzaEfectivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CobranzaEfectivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
