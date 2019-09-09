import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChoferProveedorComponent } from 'src/app/componentes/chofer-proveedor/chofer-proveedor.component';

const routes: Routes = [
  {path: '', component: ChoferProveedorComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChoferProveedorRoutingModule { }
