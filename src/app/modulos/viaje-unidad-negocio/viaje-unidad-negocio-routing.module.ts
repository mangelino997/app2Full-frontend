import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViajeUnidadNegocioComponent } from 'src/app/componentes/viaje-unidad-negocio/viaje-unidad-negocio.component';

const routes: Routes = [
  {path: '', component: ViajeUnidadNegocioComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViajeUnidadNegocioRoutingModule { }
