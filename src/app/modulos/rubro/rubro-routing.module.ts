import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RubroComponent } from 'src/app/componentes/rubro/rubro.component';

const routes: Routes = [
  {path: '', component: RubroComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RubroRoutingModule { }
