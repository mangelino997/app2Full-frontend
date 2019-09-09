import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CobradorComponent } from 'src/app/componentes/cobrador/cobrador.component';

const routes: Routes = [
  {path: '', component: CobradorComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CobradorRoutingModule { }
