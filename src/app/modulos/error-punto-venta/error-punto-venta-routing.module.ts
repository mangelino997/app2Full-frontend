import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ErrorPuntoVentaComponent } from 'src/app/componentes/error-punto-venta/error-punto-venta.component';

const routes: Routes = [
  {path: '', component: ErrorPuntoVentaComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ErrorPuntoVentaRoutingModule { }
