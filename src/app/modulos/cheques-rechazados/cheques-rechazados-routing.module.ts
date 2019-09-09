import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChequesRechazadosComponent } from 'src/app/componentes/cheques-rechazados/cheques-rechazados.component';

const routes: Routes = [
  {path: '', component: ChequesRechazadosComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChequesRechazadosRoutingModule { }
