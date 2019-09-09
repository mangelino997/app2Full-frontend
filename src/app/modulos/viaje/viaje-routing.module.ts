import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViajeComponent } from 'src/app/componentes/viaje/viaje.component';

const routes: Routes = [
  {path: '', component: ViajeComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViajeRoutingModule { }
