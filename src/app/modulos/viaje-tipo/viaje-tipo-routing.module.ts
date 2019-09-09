import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViajeTipoComponent } from 'src/app/componentes/viaje-tipo/viaje-tipo.component';

const routes: Routes = [
  {path: '', component: ViajeTipoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViajeTipoRoutingModule { }
