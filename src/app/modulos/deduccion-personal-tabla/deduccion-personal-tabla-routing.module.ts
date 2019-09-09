import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeduccionPersonalTablaComponent } from 'src/app/componentes/deduccion-personal-tabla/deduccion-personal-tabla.component';

const routes: Routes = [
  {path: '', component: DeduccionPersonalTablaComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeduccionPersonalTablaRoutingModule { }
