import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EstadoServicioAfipComponent } from 'src/app/componentes/estado-servicio-afip/estado-servicio-afip.component';

const routes: Routes = [
  {path: '', component: EstadoServicioAfipComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstadoServicioAfipRoutingModule { }
