import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EscalaTarifaComponent } from 'src/app/componentes/escala-tarifa/escala-tarifa.component';

const routes: Routes = [
  {path: '', component: EscalaTarifaComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EscalaTarifaRoutingModule { }
