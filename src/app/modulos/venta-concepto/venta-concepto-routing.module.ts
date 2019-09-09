import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VentaConceptoComponent } from 'src/app/componentes/venta-concepto/venta-concepto.component';

const routes: Routes = [
  {path: '', component: VentaConceptoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentaConceptoRoutingModule { }
