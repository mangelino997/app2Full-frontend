import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SucursalComponent } from 'src/app/componentes/sucursal/sucursal.component';

const routes: Routes = [
  {path: '', component: SucursalComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SucursalRoutingModule { }
