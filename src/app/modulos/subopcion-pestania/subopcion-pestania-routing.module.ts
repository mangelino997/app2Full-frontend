import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SubopcionPestaniaComponent } from 'src/app/componentes/subopcion-pestania/subopcion-pestania.component';

const routes: Routes = [
  {path: '', component: SubopcionPestaniaComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubopcionPestaniaRoutingModule { }
