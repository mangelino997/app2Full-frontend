import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CobranzaItemComponent } from './cobranza-item.component';

describe('CobranzaItemComponent', () => {
  let component: CobranzaItemComponent;
  let fixture: ComponentFixture<CobranzaItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CobranzaItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CobranzaItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
