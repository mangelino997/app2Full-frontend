import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActualizacionPreciosComponent } from 'src/app/componentes/actualizacion-precios/actualizacion-precios.component';

const routes: Routes = [
  {path: '', component: ActualizacionPreciosComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActualizacionPreciosRoutingModule { }
