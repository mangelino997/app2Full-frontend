import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TipoProveedorComponent } from 'src/app/componentes/tipo-proveedor/tipo-proveedor.component';

const routes: Routes = [
  {path: '', component: TipoProveedorComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TipoProveedorRoutingModule { }
