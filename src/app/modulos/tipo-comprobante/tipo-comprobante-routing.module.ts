import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TipoComprobanteComponent } from 'src/app/componentes/tipo-comprobante/tipo-comprobante.component';

const routes: Routes = [
  {path: '', component: TipoComprobanteComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TipoComprobanteRoutingModule { }
