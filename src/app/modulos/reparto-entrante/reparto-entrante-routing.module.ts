import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RepartoEntranteComponent } from 'src/app/componentes/reparto-entrante/reparto-entrante.component';

const routes: Routes = [
  {path: '', component: RepartoEntranteComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RepartoEntranteRoutingModule { }
