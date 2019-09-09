import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ObraSocialComponent } from 'src/app/componentes/obra-social/obra-social.component';

const routes: Routes = [
  {path: '', component: ObraSocialComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ObraSocialRoutingModule { }
