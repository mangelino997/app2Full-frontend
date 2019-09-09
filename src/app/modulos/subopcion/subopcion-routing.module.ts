import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SubopcionComponent } from 'src/app/componentes/subopcion/subopcion.component';

const routes: Routes = [
  {path: '', component: SubopcionComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubopcionRoutingModule { }
