import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactoClienteComponent } from 'src/app/componentes/contacto-cliente/contacto-cliente.component';

const routes: Routes = [
  {path: '', component: ContactoClienteComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactoClienteRoutingModule { }
