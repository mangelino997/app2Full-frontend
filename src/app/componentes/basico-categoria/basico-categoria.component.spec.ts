import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicoCategoriaComponent } from './basico-categoria.component';

describe('BasicoCategoriaComponent', () => {
  let component: BasicoCategoriaComponent;
  let fixture: ComponentFixture<BasicoCategoriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicoCategoriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicoCategoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
