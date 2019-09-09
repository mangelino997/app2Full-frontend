import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrigenDestinoComponent } from 'src/app/componentes/origen-destino/origen-destino.component';

const routes: Routes = [
  {path: '', component: OrigenDestinoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrigenDestinoRoutingModule { }
