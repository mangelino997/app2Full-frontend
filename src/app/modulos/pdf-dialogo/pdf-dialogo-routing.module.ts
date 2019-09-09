import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PdfDialogoComponent } from 'src/app/componentes/pdf-dialogo/pdf-dialogo.component';

const routes: Routes = [
  {path: '', component: PdfDialogoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PdfDialogoRoutingModule { }
