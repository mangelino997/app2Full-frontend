import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TipoChequeraComponent } from 'src/app/componentes/tipo-chequera/tipo-chequera.component';

const routes: Routes = [
  {path: '', component: TipoChequeraComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TipoChequeraRoutingModule { }
