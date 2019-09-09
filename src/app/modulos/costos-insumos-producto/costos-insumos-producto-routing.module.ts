import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CostosInsumosProductoComponent } from 'src/app/componentes/costos-insumos-producto/costos-insumos-producto.component';

const routes: Routes = [
  {path: '', component: CostosInsumosProductoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CostosInsumosProductoRoutingModule { }
