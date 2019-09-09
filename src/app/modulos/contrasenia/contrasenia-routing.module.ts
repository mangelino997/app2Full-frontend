import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContraseniaComponent } from 'src/app/componentes/contrasenia/contrasenia.component';

const routes: Routes = [
  {path: '', component: ContraseniaComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContraseniaRoutingModule { }
