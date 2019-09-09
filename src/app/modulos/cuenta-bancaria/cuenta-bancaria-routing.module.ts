import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CuentaBancariaComponent } from 'src/app/componentes/cuenta-bancaria/cuenta-bancaria.component';

const routes: Routes = [
  {path: '', component: CuentaBancariaComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CuentaBancariaRoutingModule { }
