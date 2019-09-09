import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CuentaBancariaDialogoComponent } from 'src/app/componentes/cuenta-bancaria-dialogo/cuenta-bancaria-dialogo.component';

const routes: Routes = [
  {path: '', component: CuentaBancariaDialogoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CuentaBancariaDialogoRoutingModule { }
