import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TipoConceptoVentaComponent } from 'src/app/componentes/tipo-concepto-venta/tipo-concepto-venta.component';

const routes: Routes = [
  {path: '', component: TipoConceptoVentaComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TipoConceptoVentaRoutingModule { }
