import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VentaTipoRoutingModule } from './venta-tipo-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VentaTipoComponent } from 'src/app/componentes/venta-tipo/venta-tipo.component';

@NgModule({
  declarations: [
    VentaTipoComponent,
  ],
  imports: [
    CommonModule,
    VentaTipoRoutingModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatProgressBarModule
  ]
})
export class VentaTipoModule { }
