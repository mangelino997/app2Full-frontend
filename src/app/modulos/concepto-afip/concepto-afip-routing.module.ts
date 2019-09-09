import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConceptoAfipComponent } from 'src/app/componentes/concepto-afip/concepto-afip.component';

const routes: Routes = [
  {path: '', component: ConceptoAfipComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConceptoAfipRoutingModule { }
