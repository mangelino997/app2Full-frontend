import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactoClienteRoutingModule } from './contacto-cliente-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContactoClienteComponent } from 'src/app/componentes/contacto-cliente/contacto-cliente.component';
import { ContactoClienteService } from 'src/app/servicios/contacto-cliente.service';

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
    MatProgressBarModule
  ],
  providers: [
    ContactoClienteService
  ]
})
export class ContactoClienteModule { }
