import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AforoComponent } from 'src/app/componentes/aforo/aforo.component';

const routes: Routes = [
  {path: '', component: AforoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AforoRoutingModule { }
