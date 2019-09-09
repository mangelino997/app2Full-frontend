import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrdenVentaComponent } from 'src/app/componentes/orden-venta/orden-venta.component';

const routes: Routes = [
  {path: '', component: OrdenVentaComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdenVentaRoutingModule { }
