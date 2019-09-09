import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompaniaSeguroPolizaComponent } from 'src/app/componentes/compania-seguro-poliza/compania-seguro-poliza.component';

const routes: Routes = [
  {path: '', component: CompaniaSeguroPolizaComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompaniaSeguroPolizaRoutingModule { }
