import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdelantoLoteComponent } from 'src/app/componentes/adelanto-lote/adelanto-lote.component';

const routes: Routes = [
  {path:'', component: AdelantoLoteComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdelantoLoteRoutingModule { }
