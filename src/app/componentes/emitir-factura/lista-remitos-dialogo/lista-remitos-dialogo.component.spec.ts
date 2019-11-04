import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaRemitosDialogoComponent } from './lista-remitos-dialogo.component';

describe('ListaRemitosDialogoComponent', () => {
  let component: ListaRemitosDialogoComponent;
  let fixture: ComponentFixture<ListaRemitosDialogoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaRemitosDialogoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaRemitosDialogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
