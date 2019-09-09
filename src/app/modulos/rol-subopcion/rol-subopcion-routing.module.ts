import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RolSubopcionComponent } from 'src/app/componentes/rol-subopcion/rol-subopcion.component';

const routes: Routes = [
  {path: '', component: RolSubopcionComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolSubopcionRoutingModule { }
