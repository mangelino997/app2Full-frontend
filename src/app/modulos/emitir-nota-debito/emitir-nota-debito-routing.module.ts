import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmitirNotaDebitoComponent } from 'src/app/componentes/emitir-nota-debito/emitir-nota-debito.component';

const routes: Routes = [
  {path: '', component: EmitirNotaDebitoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmitirNotaDebitoRoutingModule { }
