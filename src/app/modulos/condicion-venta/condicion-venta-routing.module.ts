import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CondicionVentaComponent } from 'src/app/componentes/condicion-venta/condicion-venta.component';

const routes: Routes = [
  {path: '', component: CondicionVentaComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CondicionVentaRoutingModule { }
