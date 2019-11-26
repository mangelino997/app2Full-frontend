import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmitirNotaCreditoRoutingModule } from './emitir-nota-credito-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatCheckboxModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmitirNotaCreditoComponent } from 'src/app/componentes/emitir-nota-credito/emitir-nota-credito.component';
import { NotaCredito } from 'src/app/modelos/notaCredito';
import { AfipActividadService } from 'src/app/servicios/afip-actividad.service';
import { AfipComprobanteService } from 'src/app/servicios/afip-comprobante.service';
import { PuntoVentaService } from 'src/app/servicios/punto-venta.service';
import { ClienteService } from 'src/app/servicios/cliente.service';
import { ProvinciaService } from 'src/app/servicios/provincia.service';
import { VentaComprobanteService } from 'src/app/servicios/venta-comprobante.service';
import { VentaTipoItemService } from 'src/app/servicios/venta-tipo-item.service';
import { AfipAlicuotaIvaService } from 'src/app/servicios/afip-alicuota-iva.service';
import { VentaComprobante } from 'src/app/modelos/ventaComprobante';
import { VentaComprobanteItemNC } from 'src/app/modelos/ventaComprobanteItemNC';

@NgModule({
  declarations: [
    EmitirNotaCreditoComponent,
  ],
  imports: [
    CommonModule,
    EmitirNotaCreditoRoutingModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatProgressBarModule,
    MatCheckboxModule
  ],
  providers: [
    VentaComprobante,
    VentaComprobanteItemNC,
    AfipActividadService,
    AfipComprobanteService,
    PuntoVentaService,
    ClienteService,
    ProvinciaService,
    VentaComprobanteService,
    VentaTipoItemService,
    AfipAlicuotaIvaService
  ]
})
export class EmitirNotaCreditoModule { }
