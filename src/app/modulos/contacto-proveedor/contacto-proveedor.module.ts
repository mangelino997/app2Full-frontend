import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactoProveedorRoutingModule } from './contacto-proveedor-routing.module';

import {
  MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule,
  MatSelectModule, MatProgressBarModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContactoProveedorComponent } from 'src/app/componentes/contacto-proveedor/contacto-proveedor.component';
import { ContactoProveedorService } from 'src/app/servicios/contacto-proveedor.service';
import { ProveedorService } from 'src/app/servicios/proveedor.service';
import { ContactoProveedor } from 'src/app/modelos/contactoProveedor';

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
    MatProgressBarModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  providers: [
    ContactoProveedorService,
    ProveedorService,
    ContactoProveedor
  ]
})
export class ContactoProveedorModule { }
