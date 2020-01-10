import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdenPagoRoutingModule } from './orden-pago-routing.module';
import { OrdenPagoComponent } from 'src/app/componentes/orden-pago/orden-pago.component';
import { OrdenPagoService } from 'src/app/servicios/orden-pago.service';
import { OrdenPago } from 'src/app/modelos/orden-pago';
import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatButtonModule, MatIconModule, MatTooltipModule, 
  MatListModule, MatDialogModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompraComprobanteService } from 'src/app/servicios/compra-comprobante.service';
import { TextMaskModule } from 'angular2-text-mask';

@NgModule({
  declarations: [
    OrdenPagoComponent,
  ],
  imports: [
    CommonModule,
    OrdenPagoRoutingModule,
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
    MatTooltipModule,
    MatListModule,
    MatDialogModule,
    TextMaskModule
  ],
  providers: [
    OrdenPagoService,
    OrdenPago,
    CompraComprobanteService
  ],
  entryComponents: []
})
export class OrdenPagoModule { }