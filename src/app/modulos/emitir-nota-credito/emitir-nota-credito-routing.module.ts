import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmitirNotaCreditoComponent } from 'src/app/componentes/emitir-nota-credito/emitir-nota-credito.component';

const routes: Routes = [
  {path: '', component: EmitirNotaCreditoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmitirNotaCreditoRoutingModule { }
