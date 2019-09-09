import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EjercicioComponent } from 'src/app/componentes/ejercicio/ejercicio.component';

const routes: Routes = [
  {path: '', component: EjercicioComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EjercicioRoutingModule { }
