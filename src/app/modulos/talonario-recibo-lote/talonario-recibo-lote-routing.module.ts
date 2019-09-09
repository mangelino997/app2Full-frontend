import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TalonarioReciboLoteComponent } from 'src/app/componentes/talonario-recibo-lote/talonario-recibo-lote.component';

const routes: Routes = [
  {path: '', component: TalonarioReciboLoteComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TalonarioReciboLoteRoutingModule { }
