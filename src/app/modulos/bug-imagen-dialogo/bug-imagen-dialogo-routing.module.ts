import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BugImagenDialogoComponent } from 'src/app/componentes/bugImagen-dialogo/bug-imagen-dialogo.component';

const routes: Routes = [
  {path: '', component: BugImagenDialogoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BugImagenDialogoRoutingModule { }
