import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeduccionGeneralTopeComponent } from 'src/app/componentes/deduccion-general-tope/deduccion-general-tope.component';

const routes: Routes = [
  {path: '', component: DeduccionGeneralTopeComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeduccionGeneralTopeRoutingModule { }
