import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResumenClienteComponent } from 'src/app/componentes/resumen-cliente/resumen-cliente.component';

const routes: Routes = [
  {path: '', component: ResumenClienteComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResumenClienteRoutingModule { }
