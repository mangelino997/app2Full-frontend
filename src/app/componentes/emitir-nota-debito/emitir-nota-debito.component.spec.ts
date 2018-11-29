import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmitirNotaDebitoComponent } from './emitir-nota-debito.component';

describe('EmitirNotaDebitoComponent', () => {
  let component: EmitirNotaDebitoComponent;
  let fixture: ComponentFixture<EmitirNotaDebitoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmitirNotaDebitoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmitirNotaDebitoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
