import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TipoLiquidacionSueldoComponent } from 'src/app/componentes/tipo-liquidacion-sueldo/tipo-liquidacion-sueldo.component';

const routes: Routes = [
  {path: '', component: TipoLiquidacionSueldoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TipoLiquidacionSueldoRoutingModule { }
