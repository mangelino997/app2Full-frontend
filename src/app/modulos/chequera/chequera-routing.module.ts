import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChequeraComponent } from 'src/app/componentes/chequera/chequera.component';

const routes: Routes = [
  {path: '', component: ChequeraComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChequeraRoutingModule { }
