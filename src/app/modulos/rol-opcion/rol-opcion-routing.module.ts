import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RolOpcionComponent } from 'src/app/componentes/rol-opcion/rol-opcion.component';

const routes: Routes = [
  {path: '', component: RolOpcionComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolOpcionRoutingModule { }
