import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RubroProductoComponent } from 'src/app/componentes/rubro-producto/rubro-producto.component';

const routes: Routes = [
  {path: '', component: RubroProductoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RubroProductoRoutingModule { }
