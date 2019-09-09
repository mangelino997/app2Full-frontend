import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactoProveedorRoutingModule } from './contacto-proveedor-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContactoProveedorComponent } from 'src/app/componentes/contacto-proveedor/contacto-proveedor.component';
import { ContactoProveedorService } from 'src/app/servicios/contacto-proveedor.service';

@NgModule({
  declarations: [
    ContactoProveedorComponent,
  ],
  imports: [
    CommonModule,
    ContactoProveedorRoutingModule,
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
    ContactoProveedorService
  ]
})
export class ContactoProveedorModule { }
