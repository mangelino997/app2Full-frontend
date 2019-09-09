import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PuntoVentaComponent } from 'src/app/componentes/punto-venta/punto-venta.component';

const routes: Routes = [
  {path: '', component: PuntoVentaComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PuntoVentaRoutingModule { }
