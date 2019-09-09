import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactoBancoComponent } from 'src/app/componentes/contacto-banco/contacto-banco.component';

const routes: Routes = [
  {path: '', component: ContactoBancoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactoBancoRoutingModule { }
