import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactoCompaniaSeguroRoutingModule } from './contacto-compania-seguro-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatButtonModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContactoCompaniaSeguroComponent } from 'src/app/componentes/contacto-compania-seguro/contacto-compania-seguro.component';
import { ContactoCompaniaSeguroService } from 'src/app/servicios/contacto-compania-seguro.service';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { CompaniaSeguroService } from 'src/app/servicios/compania-seguro.service';
import { TipoContactoService } from 'src/app/servicios/tipo-contacto.service';

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
    MatButtonModule
  ],
  providers: [
    ContactoCompaniaSeguroService,
    SubopcionPestaniaService,
    CompaniaSeguroService,
    TipoContactoService
  ]
})
export class ContactoCompaniaSeguroModule { }
