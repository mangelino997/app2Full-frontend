import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrdenPagoComponent } from 'src/app/componentes/orden-pago/orden-pago.component';

const routes: Routes = [
  { path: '', component: OrdenPagoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdenPagoRoutingModule { }
