import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AfipCondicionIvaComponent } from 'src/app/componentes/afip-condicion-iva/afip-condicion-iva.component';

const routes: Routes = [
  {path: '', component: AfipCondicionIvaComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AfipCondicionIvaRoutingModule { }
