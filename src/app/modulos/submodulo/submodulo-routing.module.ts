import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SubmoduloComponent } from 'src/app/componentes/submodulo/submodulo.component';

const routes: Routes = [
  {path: '', component: SubmoduloComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubmoduloRoutingModule { }
