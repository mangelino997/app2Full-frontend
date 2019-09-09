import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TipoCuentaContableComponent } from 'src/app/componentes/tipo-cuenta-contable/tipo-cuenta-contable.component';

const routes: Routes = [
  {path: '', component: TipoCuentaContableComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TipoCuentaContableRoutingModule { }
