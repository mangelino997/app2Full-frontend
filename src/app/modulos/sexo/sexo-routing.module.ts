import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SexoComponent } from 'src/app/componentes/sexo/sexo.component';

const routes: Routes = [
  {path: '', component: SexoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SexoRoutingModule { }
