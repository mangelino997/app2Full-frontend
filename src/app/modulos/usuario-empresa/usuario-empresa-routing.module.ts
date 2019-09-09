import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsuarioEmpresaComponent } from 'src/app/componentes/usuario-empresa/usuario-empresa.component';

const routes: Routes = [
  {path: '', component: UsuarioEmpresaComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuarioEmpresaRoutingModule { }
