import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CostosInsumosProductoComponent } from './costos-insumos-producto.component';

describe('CostosInsumosProductoComponent', () => {
  let component: CostosInsumosProductoComponent;
  let fixture: ComponentFixture<CostosInsumosProductoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CostosInsumosProductoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CostosInsumosProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
