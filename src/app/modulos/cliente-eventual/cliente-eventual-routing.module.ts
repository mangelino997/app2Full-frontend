import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClienteEventualComponent } from 'src/app/componentes/cliente-eventual/cliente-eventual.component';

const routes: Routes = [
  {path: '', component: ClienteEventualComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClienteEventualRoutingModule { }
