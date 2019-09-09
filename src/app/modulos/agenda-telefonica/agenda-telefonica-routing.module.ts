import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AgendaTelefonicaComponent } from 'src/app/componentes/agenda-telefonica/agenda-telefonica.component';

const routes: Routes = [
  {path: '', component: AgendaTelefonicaComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgendaTelefonicaRoutingModule { }
