import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompaniaSeguroComponent } from 'src/app/componentes/compania-seguro/compania-seguro.component';

const routes: Routes = [
  {path: '', component: CompaniaSeguroComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompaniaSeguroRoutingModule { }
