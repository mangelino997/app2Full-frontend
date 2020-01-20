import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FacturacionConsultaComponent } from 'src/app/componentes/facturacion-consulta/facturacion-consulta.component';

const routes: Routes = [
  {path: '', component: FacturacionConsultaComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacturacionConsultaRoutingModule { }
