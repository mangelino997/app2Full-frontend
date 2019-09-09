import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SucursalBancoComponent } from 'src/app/componentes/sucursal-banco/sucursal-banco.component';

const routes: Routes = [
  {path: '', component: SucursalBancoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SucursalBancoRoutingModule { }
