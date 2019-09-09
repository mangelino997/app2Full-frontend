import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ZonaComponent } from 'src/app/componentes/zona/zona.component';

const routes: Routes = [
  {path: '', component: ZonaComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ZonaRoutingModule { }
