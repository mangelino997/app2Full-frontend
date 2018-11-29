import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmitirNotaCreditoComponent } from './emitir-nota-credito.component';

describe('EmitirNotaCreditoComponent', () => {
  let component: EmitirNotaCreditoComponent;
  let fixture: ComponentFixture<EmitirNotaCreditoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmitirNotaCreditoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmitirNotaCreditoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
