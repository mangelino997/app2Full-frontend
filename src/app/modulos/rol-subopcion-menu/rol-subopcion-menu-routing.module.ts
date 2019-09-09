import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RolSubopcionMenuComponent } from 'src/app/componentes/rol-subopcion-menu/rol-subopcion-menu.component';

const routes: Routes = [
  {path: '', component: RolSubopcionMenuComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolSubopcionMenuRoutingModule { }
