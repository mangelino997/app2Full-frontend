import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OpcionComponent } from 'src/app/componentes/opcion/opcion.component';

const routes: Routes = [
  {path: '', component: OpcionComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OpcionRoutingModule { }
