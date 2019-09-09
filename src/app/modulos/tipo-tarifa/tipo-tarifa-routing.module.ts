import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TipoTarifaComponent } from 'src/app/componentes/tipo-tarifa/tipo-tarifa.component';

const routes: Routes = [
  {path: '', component: TipoTarifaComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TipoTarifaRoutingModule { }
