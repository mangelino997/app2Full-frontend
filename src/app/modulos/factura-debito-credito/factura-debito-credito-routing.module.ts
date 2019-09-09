import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FacturaDebitoCreditoComponent } from 'src/app/componentes/factura-debito-credito/factura-debito-credito.component';

const routes: Routes = [
  {path: '', component: FacturaDebitoCreditoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacturaDebitoCreditoRoutingModule { }
