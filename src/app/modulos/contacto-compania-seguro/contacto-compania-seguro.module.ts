import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactoCompaniaSeguroRoutingModule } from './contacto-compania-seguro-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContactoCompaniaSeguroComponent } from 'src/app/componentes/contacto-compania-seguro/contacto-compania-seguro.component';
import { ContactoCompaniaSeguroService } from 'src/app/servicios/contacto-compania-seguro.service';

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
    MatProgressBarModule
  ],
  providers: [
    ContactoCompaniaSeguroService
  ]
})
export class ContactoCompaniaSeguroModule { }
