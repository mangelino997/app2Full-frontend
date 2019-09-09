import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TipoPercepcionComponent } from 'src/app/componentes/tipo-percepcion/tipo-percepcion.component';

const routes: Routes = [
  {path: '', component: TipoPercepcionComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TipoPercepcionRoutingModule { }
