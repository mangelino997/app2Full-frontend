import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeduccionGeneralComponent } from 'src/app/componentes/deduccion-general/deduccion-general.component';

const routes: Routes = [
  {path: '', component: DeduccionGeneralComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeduccionGeneralRoutingModule { }
