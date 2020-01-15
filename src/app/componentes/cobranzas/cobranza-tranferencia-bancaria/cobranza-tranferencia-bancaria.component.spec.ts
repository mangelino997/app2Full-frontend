import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CobranzaTranferenciaBancariaComponent } from './cobranza-tranferencia-bancaria.component';

describe('CobranzaTranferenciaBancariaComponent', () => {
  let component: CobranzaTranferenciaBancariaComponent;
  let fixture: ComponentFixture<CobranzaTranferenciaBancariaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CobranzaTranferenciaBancariaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CobranzaTranferenciaBancariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
