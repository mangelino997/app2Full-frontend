import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RepartoComponent } from 'src/app/componentes/reparto-saliente/reparto.component';

const routes: Routes = [
  {path: '', component: RepartoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  entryComponents: [],
  exports: [RouterModule]
})
export class RepartoSalienteRoutingModule { }
