import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdelantoPersonalComponent } from './adelanto-personal.component';

describe('AdelantoPersonalComponent', () => {
  let component: AdelantoPersonalComponent;
  let fixture: ComponentFixture<AdelantoPersonalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdelantoPersonalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdelantoPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
