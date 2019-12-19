import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TipoConceptoVentaRoutingModule } from './tipo-concepto-venta-routing.module';

import {
  MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule,
  MatSelectModule, MatProgressBarModule, MatButtonModule, MatIconModule, MatTooltipModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TipoConceptoVentaComponent } from 'src/app/componentes/tipo-concepto-venta/tipo-concepto-venta.component';
import { VentaConcepto } from 'src/app/modelos/venta-concepto';
import { AfipConceptoVentaService } from 'src/app/servicios/afip-concepto.service';
import { TipoConceptoVentaService } from 'src/app/servicios/tipo-concepto-venta.service';

@NgModule({
  declarations: [
    TipoConceptoVentaComponent,
  ],
  imports: [
    CommonModule,
    TipoConceptoVentaRoutingModule,
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
    MatIconModule,
    MatTooltipModule
  ],
  providers: [
    TipoConceptoVentaService,
    AfipConceptoVentaService,
    VentaConcepto
  ]
})
export class VentaConceptoModule { }
