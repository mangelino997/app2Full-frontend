import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TramoComponent } from 'src/app/componentes/tramo/tramo.component';

const routes: Routes = [
  {path: '', component: TramoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TramoRoutingModule { }
