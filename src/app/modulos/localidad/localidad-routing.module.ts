import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LocalidadComponent } from 'src/app/componentes/localidad/localidad.component';

const routes: Routes = [
  {path: '', component: LocalidadComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocalidadRoutingModule { }
