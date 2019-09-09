import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BasicoCategoriaComponent } from 'src/app/componentes/basico-categoria/basico-categoria.component';

const routes: Routes = [
  {path: '', component: BasicoCategoriaComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BasicoCategoriaRoutingModule { }
