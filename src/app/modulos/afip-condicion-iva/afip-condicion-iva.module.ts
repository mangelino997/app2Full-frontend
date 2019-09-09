import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AfipCondicionIvaRoutingModule } from './afip-condicion-iva-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AfipCondicionIvaComponent } from 'src/app/componentes/afip-condicion-iva/afip-condicion-iva.component';
import { AfipCondicionIvaService } from 'src/app/servicios/afip-condicion-iva.service';

@NgModule({
  declarations: [
    AfipCondicionIvaComponent,
  ],
  imports: [
    CommonModule,
    AfipCondicionIvaRoutingModule,
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
    AfipCondicionIvaService
  ]
})
export class AfipCondicionIvaModule { }
