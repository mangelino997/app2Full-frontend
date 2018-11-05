import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniaSeguroPolizaComponent } from './compania-seguro-poliza.component';

describe('CompaniaSeguroPolizaComponent', () => {
  let component: CompaniaSeguroPolizaComponent;
  let fixture: ComponentFixture<CompaniaSeguroPolizaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompaniaSeguroPolizaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompaniaSeguroPolizaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
