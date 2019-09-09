import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmitirFacturaComponent } from 'src/app/componentes/emitir-factura/emitir-factura.component';

const routes: Routes = [
  {path: '', component: EmitirFacturaComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmitirFacturaRoutingModule { }
