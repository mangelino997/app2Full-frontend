import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TipoConceptoSueldoComponent } from 'src/app/componentes/tipo-concepto-sueldo/tipo-concepto-sueldo.component';

const routes: Routes = [
  {path: '', component: TipoConceptoSueldoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TipoConceptoSueldoRoutingModule { }
