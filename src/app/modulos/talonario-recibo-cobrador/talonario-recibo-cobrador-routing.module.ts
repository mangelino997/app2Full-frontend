import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TalonarioReciboCobradorComponent } from 'src/app/componentes/talonario-recibo-cobrador/talonario-recibo-cobrador.component';

const routes: Routes = [
  {path: '', component: TalonarioReciboCobradorComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TalonarioReciboCobradorRoutingModule { }
