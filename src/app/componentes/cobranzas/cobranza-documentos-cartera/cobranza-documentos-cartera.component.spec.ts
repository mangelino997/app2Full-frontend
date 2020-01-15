import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CobranzaDocumentosCarteraComponent } from './cobranza-documentos-cartera.component';

describe('CobranzaDocumentosCarteraComponent', () => {
  let component: CobranzaDocumentosCarteraComponent;
  let fixture: ComponentFixture<CobranzaDocumentosCarteraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CobranzaDocumentosCarteraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CobranzaDocumentosCarteraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
