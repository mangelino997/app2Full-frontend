import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteEventualComponent } from './cliente-eventual.component';

describe('ClienteEventualComponent', () => {
  let component: ClienteEventualComponent;
  let fixture: ComponentFixture<ClienteEventualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClienteEventualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClienteEventualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
