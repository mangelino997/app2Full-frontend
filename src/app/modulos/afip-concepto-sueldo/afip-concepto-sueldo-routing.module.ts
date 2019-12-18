import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AfipConceptoSueldoComponent } from 'src/app/componentes/afip-concepto-sueldo/afip-concepto-sueldo.component';

const routes: Routes = [
  {path: '', component: AfipConceptoSueldoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AfipConceptoSueldoRoutingModule { }
