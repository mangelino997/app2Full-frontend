import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ErrorPuntoVentaRoutingModule } from './error-punto-venta-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorPuntoVentaComponent } from 'src/app/componentes/error-punto-venta/error-punto-venta.component';

@NgModule({
  declarations: [
    ErrorPuntoVentaComponent,
  ],
  imports: [
    CommonModule,
    ErrorPuntoVentaRoutingModule,
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
export class ErrorPuntoVentaModule { }
