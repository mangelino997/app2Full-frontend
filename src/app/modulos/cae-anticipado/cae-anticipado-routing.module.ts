import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CaeAnticipadoComponent } from 'src/app/componentes/cae-anticipado/cae-anticipado.component';

const routes: Routes = [
  {path: '', component: CaeAnticipadoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CaeAnticipadoRoutingModule { }
