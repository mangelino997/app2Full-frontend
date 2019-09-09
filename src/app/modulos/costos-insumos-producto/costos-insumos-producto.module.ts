import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CostosInsumosProductoRoutingModule } from './costos-insumos-producto-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatDividerModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CostosInsumosProductoComponent } from 'src/app/componentes/costos-insumos-producto/costos-insumos-producto.component';
import { TextMaskModule } from 'angular2-text-mask';

@NgModule({
  declarations: [
    CostosInsumosProductoComponent,
  ],
  imports: [
    CommonModule,
    CostosInsumosProductoRoutingModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatProgressBarModule,
    MatDividerModule,
    TextMaskModule
  ]
})
export class CostosInsumosProductoModule { }
