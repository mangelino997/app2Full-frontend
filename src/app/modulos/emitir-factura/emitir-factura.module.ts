import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmitirFacturaRoutingModule } from './emitir-factura-routing.module';

import {
  MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule,
  MatSelectModule, MatProgressBarModule, MatIconModule, MatButtonModule, MatDialogModule, MatRadioModule, MatCheckboxModule, MatDialogRef
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConceptosVariosDialogo, QuitarItemDialogo, ObservacionDialogo, ViajeDialogo, EmitirFacturaComponent, OtroItemDialogo } from 'src/app/componentes/emitir-factura/emitir-factura.component';
import { TextMaskModule } from 'angular2-text-mask';
import { VentaComprobanteService } from 'src/app/servicios/venta-comprobante.service';
import { ClienteService } from 'src/app/servicios/cliente.service';
import { SucursalClienteService } from 'src/app/servicios/sucursal-cliente.service';
import { PuntoVentaService } from 'src/app/servicios/punto-venta.service';
import { TipoComprobanteService } from 'src/app/servicios/tipo-comprobante.service';
import { AfipComprobanteService } from 'src/app/servicios/afip-comprobante.service';
import { VentaTipoItemService } from 'src/app/servicios/venta-tipo-item.service';
import { OrdenVentaEscalaService } from 'src/app/servicios/orden-venta-escala.service';
import { TipoConceptoVentaService } from 'src/app/servicios/tipo-concepto-venta.service';
import { AfipAlicuotaIvaService } from 'src/app/servicios/afip-alicuota-iva.service';
import { VentaComprobante } from 'src/app/modelos/ventaComprobante';
import { VentaComprobanteItemFA } from 'src/app/modelos/ventaComprobanteItemFA';
import { EmpresaOrdenVentaService } from 'src/app/servicios/empresa-orden-venta.service';
import { OrdenVentaTarifaService } from 'src/app/servicios/orden-venta-tarifa.service';
import { TramoService } from 'src/app/servicios/tramo.service';
import { VentaConfigService } from 'src/app/servicios/venta-config.service';
import { AfipCaeService } from 'src/app/servicios/afip-cae.service';
import { ViajeTramoRemitoService } from 'src/app/servicios/viaje-tramo-remito.service';
import { VentaComprobanteItemCR } from 'src/app/modelos/ventaComprobanteItemCR';
import { ViajeTramoClienteRemitoService } from 'src/app/servicios/viaje-tramo-cliente-remito.service';
import { AforoComponent } from 'src/app/componentes/aforo/aforo.component';
import { TipoTarifaService } from 'src/app/servicios/tipo-tarifa.service';

@NgModule({
  declarations: [
    EmitirFacturaComponent,
    ConceptosVariosDialogo,
    QuitarItemDialogo,
    ObservacionDialogo,
    ViajeDialogo,
    OtroItemDialogo
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
    TextMaskModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatRadioModule,
    MatCheckboxModule,
  ],
  providers: [
    VentaComprobanteService,
    ClienteService,
    SucursalClienteService,
    PuntoVentaService,
    TipoComprobanteService,
    AfipComprobanteService,
    VentaTipoItemService,
    OrdenVentaEscalaService,
    TipoConceptoVentaService,
    AfipAlicuotaIvaService,
    VentaComprobante,
    VentaComprobanteItemFA,
    VentaComprobanteItemCR,
    EmpresaOrdenVentaService,
    OrdenVentaTarifaService,
    TramoService,
    VentaConfigService,
    AfipCaeService,
    ViajeTramoRemitoService,
    ViajeTramoClienteRemitoService,
    TipoTarifaService
  ],
  entryComponents: [
    ConceptosVariosDialogo,
    QuitarItemDialogo,
    ObservacionDialogo,
    ViajeDialogo,
    OtroItemDialogo
  ]
})
export class EmitirFacturaModule { }
