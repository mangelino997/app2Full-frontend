import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlanCuentaComponent } from 'src/app/componentes/plan-cuenta/plan-cuenta.component';

const routes: Routes = [
  {path: '', component: PlanCuentaComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanCuentaRoutingModule { }
