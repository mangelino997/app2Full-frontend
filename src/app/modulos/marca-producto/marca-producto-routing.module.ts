import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MarcaProductoComponent } from 'src/app/componentes/marca-producto/marca-producto.component';

const routes: Routes = [
  {path: '', component: MarcaProductoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarcaProductoRoutingModule { }
