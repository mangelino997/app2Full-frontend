import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProvinciaComponent } from 'src/app/componentes/provincia/provincia.component';

const routes: Routes = [
  {path: '', component: ProvinciaComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProvinciaRoutingModule { }
