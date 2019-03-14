import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequesRechazadosComponent } from './cheques-rechazados.component';

describe('ChequesRechazadosComponent', () => {
  let component: ChequesRechazadosComponent;
  let fixture: ComponentFixture<ChequesRechazadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChequesRechazadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChequesRechazadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
