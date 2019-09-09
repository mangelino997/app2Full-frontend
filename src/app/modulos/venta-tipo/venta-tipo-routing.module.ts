import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VentaTipoComponent } from 'src/app/componentes/venta-tipo/venta-tipo.component';

const routes: Routes = [
  {path: '', component: VentaTipoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentaTipoRoutingModule { }
