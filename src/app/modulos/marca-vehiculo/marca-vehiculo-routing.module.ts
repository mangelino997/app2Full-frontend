import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MarcaVehiculoComponent } from 'src/app/componentes/marca-vehiculo/marca-vehiculo.component';

const routes: Routes = [
  {path: '', component: MarcaVehiculoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarcaVehiculoRoutingModule { }
