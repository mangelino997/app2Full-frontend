import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BarrioComponent } from 'src/app/componentes/barrio/barrio.component';

const routes: Routes = [
  {path: '', component: BarrioComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BarrioRoutingModule { }
