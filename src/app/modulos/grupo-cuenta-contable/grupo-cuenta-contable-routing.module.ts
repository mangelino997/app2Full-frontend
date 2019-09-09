import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GrupoCuentaContableComponent } from 'src/app/componentes/grupo-cuenta-contable/grupo-cuenta-contable.component';

const routes: Routes = [
  {path: '', component: GrupoCuentaContableComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GrupoCuentaContableRoutingModule { }
