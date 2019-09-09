import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrdenRecoleccionComponent } from 'src/app/componentes/orden-recoleccion/orden-recoleccion.component';

const routes: Routes = [
  {path: '', component: OrdenRecoleccionComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdenRecoleccionRoutingModule { }
