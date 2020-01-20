import { NgModule } from '@angular/core';

import { OrdenPagoRoutingModule } from './orden-pago-routing.module';
import { OrdenPagoComponent } from 'src/app/componentes/orden-pago/orden-pago.component';
import { OrdenPagoService } from 'src/app/servicios/orden-pago.service';
import { OrdenPago } from 'src/app/modelos/orden-pago';
import { CompraComprobanteService } from 'src/app/servicios/compra-comprobante.service';
import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, MatSelectModule, MatProgressBarModule, MatButtonModule, MatIconModule, MatTooltipModule, MatListModule, MatDialogModule, MatCheckboxModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { PagoEfectivoComponent } from 'src/app/componentes/orden-pago/pago-efectivo/pago-efectivo.component';
import { PagoAnticiposComponent } from 'src/app/componentes/orden-pago/pago-anticipos/pago-anticipos.component';
import { CommonModule } from '@angular/common';
import { PagoChequesCarteraComponent } from 'src/app/componentes/orden-pago/pago-cheques-cartera/pago-cheques-cartera.component';
import { PagoChequesElectronicosComponent } from 'src/app/componentes/orden-pago/pago-cheques-electronicos/pago-cheques-electronicos.component';
import { PagoChequesPropiosComponent } from 'src/app/componentes/orden-pago/pago-cheques-propios/pago-cheques-propios.component';
import { PagoDocumentosComponent } from 'src/app/componentes/orden-pago/pago-documentos/pago-documentos.component';
import { PagoOtrasCuentasComponent } from 'src/app/componentes/orden-pago/pago-otras-cuentas/pago-otras-cuentas.component';
import { PagoOtrasMonedasComponent } from 'src/app/componentes/orden-pago/pago-otras-monedas/pago-otras-monedas.component';
import { PagoTransferenciaBancariaComponent } from 'src/app/componentes/orden-pago/pago-transferencia-bancaria/pago-transferencia-bancaria.component';
import { PagoAnticipoService } from 'src/app/servicios/pago-anticipo.service';
import { CuentaBancariaService } from 'src/app/servicios/cuenta-bancaria.service';
import { ChequeraService } from 'src/app/servicios/chequera.service';
import { ChequeCarteraService } from 'src/app/servicios/cheque-cartera.service';
import { TipoDocumentoCarteraService } from 'src/app/servicios/tipo-documento-cartera.service';
import { DetalleRetencionesComponent } from 'src/app/componentes/orden-pago/detalle-retenciones/detalle-retenciones.component';
import { TipoRetencionService } from 'src/app/servicios/tipo-retencion.service';
import { MesService } from 'src/app/servicios/mes.service';
import { ProvinciaService } from 'src/app/servicios/provincia.service';
import { ComprobanteComponent } from 'src/app/componentes/orden-pago/comprobante/comprobante.component';

@NgModule({
  declarations: [
    OrdenPagoComponent,
    PagoAnticiposComponent,
    PagoChequesCarteraComponent,
    PagoChequesElectronicosComponent,
    PagoChequesPropiosComponent,
    PagoDocumentosComponent,
    PagoEfectivoComponent,
    PagoOtrasCuentasComponent,
    PagoOtrasMonedasComponent,
    PagoTransferenciaBancariaComponent,
    DetalleRetencionesComponent,
    ComprobanteComponent
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
    TextMaskModule,
    MatCheckboxModule
  ],
  providers: [
    OrdenPagoService,
    OrdenPago,
    CompraComprobanteService,
    PagoAnticipoService,
    CuentaBancariaService,
    ChequeraService,
    ChequeCarteraService,
    TipoDocumentoCarteraService,
    TipoRetencionService,
    MesService,
    ProvinciaService
  ],
  entryComponents: [
    PagoAnticiposComponent,
    PagoChequesCarteraComponent,
    PagoChequesElectronicosComponent,
    PagoChequesPropiosComponent,
    PagoDocumentosComponent,
    PagoEfectivoComponent,
    PagoOtrasCuentasComponent,
    PagoOtrasMonedasComponent,
    PagoTransferenciaBancariaComponent,
    DetalleRetencionesComponent,
    ComprobanteComponent
  ]
})
export class OrdenPagoModule { }