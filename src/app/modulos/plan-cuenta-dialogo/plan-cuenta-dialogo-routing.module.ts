import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlanCuentaDialogo } from 'src/app/componentes/plan-cuenta-dialogo/plan-cuenta-dialogo.component';

const routes: Routes = [
  {path: '', component: PlanCuentaDialogo}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanCuentaDialogoRoutingModule { }
