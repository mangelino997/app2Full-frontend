import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FacturaDebitoCreditoRoutingModule } from './factura-debito-credito-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FacturaDebitoCreditoComponent } from 'src/app/componentes/factura-debito-credito/factura-debito-credito.component';
import { TextMaskModule } from 'angular2-text-mask';

@NgModule({
  declarations: [
    FacturaDebitoCreditoComponent,
  ],
  imports: [
    CommonModule,
    FacturaDebitoCreditoRoutingModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatProgressBarModule,
    TextMaskModule
  ]
})
export class FacturaDebitoCreditoModule { }
