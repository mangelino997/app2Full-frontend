import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SucursalClienteComponent } from 'src/app/componentes/sucursal-cliente/sucursal-cliente.component';

const routes: Routes = [
  {path: '', component: SucursalClienteComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SucursalClienteRoutingModule { }
