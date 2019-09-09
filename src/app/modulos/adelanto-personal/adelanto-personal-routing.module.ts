import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdelantoPersonalComponent } from 'src/app/componentes/adelanto-personal/adelanto-personal.component';

const routes: Routes = [
  {path: '', component: AdelantoPersonalComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdelantoPersonalRoutingModule { }
