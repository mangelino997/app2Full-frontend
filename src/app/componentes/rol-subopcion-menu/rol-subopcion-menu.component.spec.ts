import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RolSubopcionMenuComponent } from './rol-subopcion-menu.component';

describe('RolSubopcionMenuComponent', () => {
  let component: RolSubopcionMenuComponent;
  let fixture: ComponentFixture<RolSubopcionMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RolSubopcionMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RolSubopcionMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
