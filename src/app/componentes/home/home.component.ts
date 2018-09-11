import { Component } from '@angular/core';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent {
  constructor(private appComponent: AppComponent) {
    this.appComponent.setVisible(true);
    this.appComponent.obtenerMenu();
  }
}
