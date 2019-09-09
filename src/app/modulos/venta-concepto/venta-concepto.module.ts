import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VentaConceptoRoutingModule } from './venta-concepto-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VentaConceptoComponent } from 'src/app/componentes/venta-concepto/venta-concepto.component';

@NgModule({
  declarations: [
    VentaConceptoComponent,
  ],
  imports: [
    CommonModule,
    VentaConceptoRoutingModule,
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
export class VentaConceptoModule { }
