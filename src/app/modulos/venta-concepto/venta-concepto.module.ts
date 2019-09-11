import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VentaConceptoRoutingModule } from './venta-concepto-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatButtonModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VentaConceptoComponent } from 'src/app/componentes/venta-concepto/venta-concepto.component';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { VentaItemConceptoService } from 'src/app/servicios/venta-item-concepto.service';
import { VentaConcepto } from 'src/app/modelos/venta-concepto';
import { TipoComprobanteService } from 'src/app/servicios/tipo-comprobante.service';
import { AfipConceptoService } from 'src/app/servicios/afip-concepto.service';

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
    MatProgressBarModule,
    MatButtonModule
  ],
  providers: [
    SubopcionPestaniaService,
    VentaItemConceptoService,
    TipoComprobanteService,
    AfipConceptoService,
    VentaConcepto
  ]
})
export class VentaConceptoModule { }
