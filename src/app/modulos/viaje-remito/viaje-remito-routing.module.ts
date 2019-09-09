import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViajeRemitoComponent } from 'src/app/componentes/viaje-remito/viaje-remito.component';

const routes: Routes = [
  {path: '', component: ViajeRemitoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViajeRemitoRoutingModule { }
