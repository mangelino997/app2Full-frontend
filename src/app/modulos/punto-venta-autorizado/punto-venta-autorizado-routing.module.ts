import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PuntosVentaAutorizadoComponent } from 'src/app/componentes/puntos-venta-autorizado/puntos-venta-autorizado.component';

const routes: Routes = [
  {path: '', component: PuntosVentaAutorizadoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PuntoVentaAutorizadoRoutingModule { }
