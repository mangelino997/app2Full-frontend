import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenCombustibleComponent } from './orden-combustible.component';

describe('OrdenCombustibleComponent', () => {
  let component: OrdenCombustibleComponent;
  let fixture: ComponentFixture<OrdenCombustibleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdenCombustibleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdenCombustibleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
