import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VencimientosChoferesComponent } from 'src/app/componentes/vencimientos-choferes/vencimientos-choferes.component';

const routes: Routes = [
  {path: '', component: VencimientosChoferesComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VencimientosChoferesRoutingModule { }
