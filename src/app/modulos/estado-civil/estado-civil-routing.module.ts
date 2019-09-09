import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EstadoCivilComponent } from 'src/app/componentes/estado-civil/estado-civil.component';

const routes: Routes = [
  {path: '', component: EstadoCivilComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstadoCivilRoutingModule { }
