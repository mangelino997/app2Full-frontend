import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactoBancoRoutingModule } from './contacto-banco-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContactoBancoComponent } from 'src/app/componentes/contacto-banco/contacto-banco.component';
import { ContactoBancoService } from 'src/app/servicios/contacto-banco.service';

@NgModule({
  declarations: [
    ContactoBancoComponent,
  ],
  imports: [
    CommonModule,
    ContactoBancoRoutingModule,
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
    ContactoBancoService
  ]
})
export class ContactoBancoModule { }
