import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactoCompaniaSeguroComponent } from 'src/app/componentes/contacto-compania-seguro/contacto-compania-seguro.component';

const routes: Routes = [
  {path: '', component: ContactoCompaniaSeguroComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactoCompaniaSeguroRoutingModule { }
