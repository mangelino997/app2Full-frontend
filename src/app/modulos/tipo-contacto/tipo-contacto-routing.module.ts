import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TipoContactoComponent } from 'src/app/componentes/tipo-contacto/tipo-contacto.component';

const routes: Routes = [
  {path: '', component: TipoContactoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TipoContactoRoutingModule { }
