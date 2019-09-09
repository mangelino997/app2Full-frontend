import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SituacionClienteComponent } from 'src/app/componentes/situacion-cliente/situacion-cliente.component';

const routes: Routes = [
  {path: '', component: SituacionClienteComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SituacionClienteRoutingModule { }
