import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactoCompaniaSeguroRoutingModule } from './contacto-compania-seguro-routing.module';

import {
  MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule,
  MatSelectModule, MatProgressBarModule, MatButtonModule, MatIconModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContactoCompaniaSeguroComponent } from 'src/app/componentes/contacto-compania-seguro/contacto-compania-seguro.component';
import { ContactoCompaniaSeguroService } from 'src/app/servicios/contacto-compania-seguro.service';
import { CompaniaSeguroService } from 'src/app/servicios/compania-seguro.service';
import { ContactoCompaniaSeguro } from 'src/app/modelos/contactoCompaniaSeguro';

@NgModule({
  declarations: [
    ContactoCompaniaSeguroComponent,
  ],
  imports: [
    CommonModule,
    ContactoCompaniaSeguroRoutingModule,
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
    ContactoCompaniaSeguroService,
    CompaniaSeguroService,
    ContactoCompaniaSeguro
  ]
})
export class ContactoCompaniaSeguroModule { }
