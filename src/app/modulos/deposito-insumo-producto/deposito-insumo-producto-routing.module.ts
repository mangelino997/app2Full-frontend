import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DepositoInsumoProductoComponent } from 'src/app/componentes/deposito-insumo-producto/deposito-insumo-producto.component';

const routes: Routes = [
  {path: '', component: DepositoInsumoProductoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepositoInsumoProductoRoutingModule { }
