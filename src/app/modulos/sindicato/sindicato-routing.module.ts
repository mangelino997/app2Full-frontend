import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SindicatoComponent } from 'src/app/componentes/sindicato/sindicato.component';

const routes: Routes = [
  {path: '', component: SindicatoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SindicatoRoutingModule { }
