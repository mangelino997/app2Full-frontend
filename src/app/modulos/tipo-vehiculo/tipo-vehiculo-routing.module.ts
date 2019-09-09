import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TipoVehiculoComponent } from 'src/app/componentes/tipo-vehiculo/tipo-vehiculo.component';

const routes: Routes = [
  {path: '', component: TipoVehiculoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TipoVehiculoRoutingModule { }
