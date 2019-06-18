import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TalonarioReciboCobradorComponent } from './talonario-recibo-cobrador.component';

describe('TalonarioReciboCobradorComponent', () => {
  let component: TalonarioReciboCobradorComponent;
  let fixture: ComponentFixture<TalonarioReciboCobradorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TalonarioReciboCobradorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TalonarioReciboCobradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
