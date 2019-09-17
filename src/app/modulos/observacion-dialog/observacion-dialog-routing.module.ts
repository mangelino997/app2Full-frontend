import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ObservacionDialogComponent } from 'src/app/componentes/observacion-dialog/observacion-dialog.component';

const routes: Routes = [
  {path: '', component: ObservacionDialogComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ObservacionDialogRoutingModule { }
