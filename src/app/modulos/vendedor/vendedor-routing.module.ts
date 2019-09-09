import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VendedorComponent } from 'src/app/componentes/vendedor/vendedor.component';

const routes: Routes = [
  {path: '', component: VendedorComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendedorRoutingModule { }
