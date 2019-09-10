import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservacionDialogComponent } from './observacion-dialog.component';

describe('ObservacionDialogComponent', () => {
  let component: ObservacionDialogComponent;
  let fixture: ComponentFixture<ObservacionDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObservacionDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObservacionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
