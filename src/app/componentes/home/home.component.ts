import { Component } from '@angular/core';
import { AppService } from 'src/app/servicios/app.service';
import { FechaService } from 'src/app/servicios/fecha.service';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent {
  //Define la fecha actual
  public fecha: any = null;
  //Define el usuario
  public usuario: any = null;
  constructor(private appComponent: AppComponent, private appService: AppService, private fechaService: FechaService) {
    this.appComponent.setVisible(true);
  }
  //Al iniciarse el componente
  ngOnInit() {
    this.fechaService.obtenerFecha().subscribe(
      res=>{
        this.fecha = res.json();
      }
    )
    this.usuario = this.appService.getUsuario();
  }
}
