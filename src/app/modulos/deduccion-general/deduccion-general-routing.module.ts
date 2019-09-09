import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeduccionPersonalComponent } from 'src/app/componentes/deduccion-personal/deduccion-personal.component';

const routes: Routes = [
  {path: '', component: DeduccionPersonalComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeduccionGeneralRoutingModule { }
