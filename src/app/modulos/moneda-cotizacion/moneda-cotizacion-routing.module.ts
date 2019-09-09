import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MonedaCotizacionComponent } from 'src/app/componentes/moneda-cotizacion/moneda-cotizacion.component';

const routes: Routes = [
  {path: '', component: MonedaCotizacionComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MonedaCotizacionRoutingModule { }
