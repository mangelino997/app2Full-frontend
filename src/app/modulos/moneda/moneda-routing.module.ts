import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MonedaComponent } from 'src/app/componentes/moneda/moneda.component';

const routes: Routes = [
  {path: '', component: MonedaComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MonedaRoutingModule { }
