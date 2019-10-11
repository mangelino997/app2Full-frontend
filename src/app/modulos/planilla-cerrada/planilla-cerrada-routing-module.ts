import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlanillaCerradaComponent } from 'src/app/componentes/planilla-cerrada/planilla-cerrada.component';

const routes: Routes = [
  {path: '', component: PlanillaCerradaComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanillaCerradaRoutingModule { }
