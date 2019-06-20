import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TalonarioReciboLoteComponent } from './talonario-recibo-lote.component';

describe('TalonarioReciboLoteComponent', () => {
  let component: TalonarioReciboLoteComponent;
  let fixture: ComponentFixture<TalonarioReciboLoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TalonarioReciboLoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TalonarioReciboLoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
