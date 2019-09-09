import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TipoCuentaBancariaComponent } from 'src/app/componentes/tipo-cuenta-bancaria/tipo-cuenta-bancaria.component';

const routes: Routes = [
  {path: '', component: TipoCuentaBancariaComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TipoCuentaBancariaRoutingModule { }
