import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConceptoAfipComponent } from './concepto-afip.component';

describe('ConceptoAfipComponent', () => {
  let component: ConceptoAfipComponent;
  let fixture: ComponentFixture<ConceptoAfipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConceptoAfipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConceptoAfipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
