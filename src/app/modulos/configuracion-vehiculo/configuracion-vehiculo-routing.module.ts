import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfiguracionVehiculoComponent } from 'src/app/componentes/configuracion-vehiculo/configuracion-vehiculo.component';

const routes: Routes = [
  {path: '', component: ConfiguracionVehiculoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfiguracionVehiculoRoutingModule { }
