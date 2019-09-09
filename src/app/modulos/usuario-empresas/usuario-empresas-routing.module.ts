import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsuarioEmpresasComponent } from 'src/app/componentes/usuario-empresas/usuario-empresas.component';

const routes: Routes = [
  {path: '', component: UsuarioEmpresasComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuarioEmpresasRoutingModule { }
