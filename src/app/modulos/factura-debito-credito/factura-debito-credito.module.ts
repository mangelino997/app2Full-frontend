import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FacturaDebitoCreditoRoutingModule } from './factura-debito-credito-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatButtonModule, MatDialogModule, MatDividerModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FacturaDebitoCreditoComponent, AgregarItemDialogo, DetallePercepcionesDialogo, DetalleVencimientosDialogo } from 'src/app/componentes/factura-debito-credito/factura-debito-credito.component';
import { TextMaskModule } from 'angular2-text-mask';
import { CondicionCompraService } from 'src/app/servicios/condicion-compra.service';
import { FacturaDebitoCredito } from 'src/app/modelos/facturaDebitoCredito';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { TipoComprobanteService } from 'src/app/servicios/tipo-comprobante.service';
import { AfipComprobanteService } from 'src/app/servicios/afip-comprobante.service';
import { ProveedorService } from 'src/app/servicios/proveedor.service';
import { CompraComprobanteService } from 'src/app/servicios/compra-comprobante.service';
import { CompraComprobanteItem } from 'src/app/modelos/compra-comprobante-item';
import { InsumoProductoService } from 'src/app/servicios/insumo-producto.service';
import { DepositoInsumoProductoService } from 'src/app/servicios/deposito-insumo-producto.service';
import { AfipAlicuotaIvaService } from 'src/app/servicios/afip-alicuota-iva.service';
import { CompraComprobantePercepcion } from 'src/app/modelos/compra-comprobante-percepcion';
import { CompraComprobantePercepcionJurisdiccion } from 'src/app/modelos/compra-comprobante-percepcion-jurisdiccion';
import { TipoPercepcionService } from 'src/app/servicios/tipo-percepcion.service';
import { MesService } from 'src/app/servicios/mes.service';
import { ProvinciaService } from 'src/app/servicios/provincia.service';
import { CompraComprobanteVencimientoService } from 'src/app/servicios/compra-comprobante-vencimiento.service';
import { CompraComprobanteVencimiento } from 'src/app/modelos/compra-comprobante-vencimiento';

@NgModule({
  declarations: [
    FacturaDebitoCreditoComponent,
    AgregarItemDialogo,
    DetallePercepcionesDialogo,
    DetalleVencimientosDialogo
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
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    TextMaskModule,
    
  ],
  providers: [
    CondicionCompraService,
    FacturaDebitoCredito,
    SubopcionPestaniaService,
    TipoComprobanteService,
    AfipComprobanteService,
    ProveedorService,
    CompraComprobanteService,
    CompraComprobanteItem,
    InsumoProductoService,
    DepositoInsumoProductoService,
    AfipAlicuotaIvaService,
    CompraComprobantePercepcion,
    CompraComprobantePercepcionJurisdiccion,
    TipoPercepcionService,
    MesService,
    ProvinciaService,
    CompraComprobanteVencimientoService,
    CompraComprobanteVencimiento
  ],
  entryComponents: [
    AgregarItemDialogo,
    DetallePercepcionesDialogo,
    DetalleVencimientosDialogo
  ]
})
export class FacturaDebitoCreditoModule { }
