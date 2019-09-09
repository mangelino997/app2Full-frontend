import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfirmarDialogoComponent } from 'src/app/componentes/confirmar-dialogo/confirmar-dialogo.component';

const routes: Routes = [
  {path: '', component: ConfirmarDialogoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfirmarDialogoRoutingModule { }
