import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CondicionCompraComponent } from 'src/app/componentes/condicion-compra/condicion-compra.component';

const routes: Routes = [
  {path: '', component: CondicionCompraComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CondicionCompraRoutingModule { }
