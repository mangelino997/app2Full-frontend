import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SeguridadSocialComponent } from 'src/app/componentes/seguridad-social/seguridad-social.component';

const routes: Routes = [
  {path: '', component: SeguridadSocialComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeguridadSocialRoutingModule { }
