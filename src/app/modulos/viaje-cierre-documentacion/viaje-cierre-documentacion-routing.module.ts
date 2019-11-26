import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViajeCierreDocumentacionComponent } from 'src/app/componentes/viaje-cierre-documentacion/viaje-cierre-documentacion.component';


const routes: Routes = [
  {path: '', component: ViajeCierreDocumentacionComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViajeCierreDocumentacionRoutingModule { }
