import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TipoRetencionComponent } from 'src/app/componentes/tipo-retencion/tipo-retencion.component';

const routes: Routes = [
  {path: '', component: TipoRetencionComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TipoRetencionRoutingModule { }
