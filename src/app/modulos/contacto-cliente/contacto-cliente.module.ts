import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactoClienteRoutingModule } from './contacto-cliente-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatButtonModule, MatIconModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContactoClienteComponent } from 'src/app/componentes/contacto-cliente/contacto-cliente.component';
import { ContactoClienteService } from 'src/app/servicios/contacto-cliente.service';
import { ClienteService } from 'src/app/servicios/cliente.service';
import { ContactoCliente } from 'src/app/modelos/contactoCliente';

@NgModule({
  declarations: [
    ContactoClienteComponent,
  ],
  imports: [
    CommonModule,
    ContactoClienteRoutingModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatProgressBarModule,
    MatButtonModule,
    MatIconModule
  ],
  providers: [
    ContactoClienteService,
    ClienteService,
    ContactoCliente
  ]
})
export class ContactoClienteModule { }