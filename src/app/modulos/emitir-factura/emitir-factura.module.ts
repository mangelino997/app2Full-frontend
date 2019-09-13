import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmitirFacturaRoutingModule } from './emitir-factura-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmitirFacturaComponent } from 'src/app/componentes/emitir-factura/emitir-factura.component';
import { TextMaskModule } from 'angular2-text-mask';
import { EmitirFactura } from 'src/app/modelos/emitirFactura';
import { VentaComprobanteService } from 'src/app/servicios/venta-comprobante.service';
import { ClienteService } from 'src/app/servicios/cliente.service';
import { SucursalClienteService } from 'src/app/servicios/sucursal-cliente.service';
import { PuntoVentaService } from 'src/app/servicios/punto-venta.service';
import { TipoComprobanteService } from 'src/app/servicios/tipo-comprobante.service';
import { AfipComprobanteService } from 'src/app/servicios/afip-comprobante.service';
import { VentaTipoItemService } from 'src/app/servicios/venta-tipo-item.service';
import { ViajeRemitoService } from 'src/app/servicios/viaje-remito.service';
import { OrdenVentaService } from 'src/app/servicios/orden-venta.service';
import { OrdenVentaEscalaService } from 'src/app/servicios/orden-venta-escala.service';
import { VentaItemConceptoService } from 'src/app/servicios/venta-item-concepto.service';
import { AfipAlicuotaIvaService } from 'src/app/servicios/afip-alicuota-iva.service';

@NgModule({
  declarations: [
    EmitirFacturaComponent,
  ],
  imports: [
    CommonModule,
    EmitirFacturaRoutingModule,
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
  ],
  providers: [
    VentaComprobanteService,
    ClienteService,
    SucursalClienteService,
    PuntoVentaService,
    TipoComprobanteService,
    AfipComprobanteService,
    VentaTipoItemService,
    ViajeRemitoService,
    OrdenVentaService,
    OrdenVentaEscalaService,
    VentaItemConceptoService,
    AfipAlicuotaIvaService,
    EmitirFactura
  ]
})
export class EmitirFacturaModule { }
