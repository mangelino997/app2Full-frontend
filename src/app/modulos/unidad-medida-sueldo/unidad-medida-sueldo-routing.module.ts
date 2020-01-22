import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UnidadMedidaSueldoComponent } from 'src/app/componentes/unidad-medida-sueldo/unidad-medida-sueldo.component';


const routes: Routes = [
  {path: '', component: UnidadMedidaSueldoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnidadMedidaSueldoRoutingModule { }
