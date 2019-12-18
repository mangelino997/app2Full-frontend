import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AfipConceptoSueldoGrupoComponent } from 'src/app/componentes/afip-concepto-sueldo-grupo/afip-concepto-sueldo-grupo.component';

const routes: Routes = [
  {path: '', component: AfipConceptoSueldoGrupoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AfipConceptoSueldoGrupoRoutingModule { }
