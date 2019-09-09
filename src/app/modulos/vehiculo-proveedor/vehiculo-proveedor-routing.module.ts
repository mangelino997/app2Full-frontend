import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VehiculoProveedorComponent } from 'src/app/componentes/vehiculo-proveedor/vehiculo-proveedor.component';

const routes: Routes = [
  {path: '', component: VehiculoProveedorComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehiculoProveedorRoutingModule { }
