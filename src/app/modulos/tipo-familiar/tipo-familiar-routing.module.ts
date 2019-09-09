import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TipoFamiliarComponent } from 'src/app/componentes/tipo-familiar/tipo-familiar.component';

const routes: Routes = [
  {path: '', component: TipoFamiliarComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TipoFamiliarRoutingModule { }
