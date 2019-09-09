import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactoProveedorComponent } from 'src/app/componentes/contacto-proveedor/contacto-proveedor.component';

const routes: Routes = [
  {path: '', component: ContactoProveedorComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactoProveedorRoutingModule { }
