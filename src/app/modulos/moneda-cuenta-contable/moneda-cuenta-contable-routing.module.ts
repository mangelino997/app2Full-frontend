import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MonedaCuentaContableComponent } from 'src/app/componentes/moneda-cuenta-contable/moneda-cuenta-contable.component';

const routes: Routes = [
  {path: '', component: MonedaCuentaContableComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MonedaCuentaContableRoutingModule { }
