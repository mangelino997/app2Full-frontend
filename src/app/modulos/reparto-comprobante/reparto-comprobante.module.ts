import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, MatSelectModule, MatProgressBarModule, MatButtonModule, MatDialogModule, MatDividerModule, MatIconModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { RepartoComprobanteRoutingModule } from './reparto-comprobante-routing-module';
import { RepartoComprobante } from 'src/app/modelos/repartoComprobante';
@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    RepartoComprobanteRoutingModule,
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
    MatDialogModule,
    MatDividerModule,
    TextMaskModule,
    MatIconModule,
  ],
  providers: [
    RepartoComprobante,
    // RepartoComprobanteService,
    // TipoComprobanteService,
    // OrdenRecoleccionService,
    // ViajeRemitoService,
    // RepartoComprobanteService,
    // VentaComprobanteService,
    // SeguimientoOrdenRecoleccionService,
    // SeguimientoViajeRemitoService,
    // SeguimientoVentaComprobanteService,
  ],
  entryComponents: [
  ]
})
export class RepartoComprobanteModule { }
