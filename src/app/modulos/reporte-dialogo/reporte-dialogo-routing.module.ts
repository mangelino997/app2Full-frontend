import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReporteDialogoComponent } from 'src/app/componentes/reporte-dialogo/reporte-dialogo.component';

const routes: Routes = [
  {path: '', component: ReporteDialogoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReporteDialogoRoutingModule { }
