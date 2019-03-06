import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AforoComponent } from './aforo.component';

describe('AforoComponent', () => {
  let component: AforoComponent;
  let fixture: ComponentFixture<AforoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AforoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AforoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
