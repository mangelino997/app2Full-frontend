import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PestaniaComponent } from 'src/app/componentes/pestania/pestania.component';

const routes: Routes = [
  {path: '', component: PestaniaComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PestaniaRoutingModule { }
