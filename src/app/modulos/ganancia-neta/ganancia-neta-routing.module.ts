import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GananciaNetaComponent } from 'src/app/componentes/ganancia-neta/ganancia-neta.component';

const routes: Routes = [
  {path: '', component: GananciaNetaComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GananciaNetaRoutingModule { }
