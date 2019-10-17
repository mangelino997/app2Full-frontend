import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RepartoComprobanteComponent } from 'src/app/componentes/reparto-comprobante/reparto-comprobante.component';

const routes: Routes = [
  {path: '', component: RepartoComprobanteComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RepartoComprobanteRoutingModule { }
