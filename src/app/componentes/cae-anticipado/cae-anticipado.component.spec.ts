import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaeAnticipadoComponent } from './cae-anticipado.component';

describe('CaeAnticipadoComponent', () => {
  let component: CaeAnticipadoComponent;
  let fixture: ComponentFixture<CaeAnticipadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaeAnticipadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaeAnticipadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
