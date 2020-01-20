import { NgModule } from '@angular/core';

import { OrdenPagoRoutingModule } from './orden-pago-routing.module';
import { OrdenPagoComponent } from 'src/app/componentes/orden-pago/orden-pago.component';
import { OrdenPagoService } from 'src/app/servicios/orden-pago.service';
import { OrdenPago } from 'src/app/modelos/orden-pago';
import { CompraComprobanteService } from 'src/app/servicios/compra-comprobante.service';
import { PagoAnticipoService } from 'src/app/servicios/pago-anticipo.service';
import { CuentaBancariaService } from 'src/app/servicios/cuenta-bancaria.service';
import { ChequeraService } from 'src/app/servicios/chequera.service';
import { ChequeCarteraService } from 'src/app/servicios/cheque-cartera.service';
import { TipoDocumentoCarteraService } from 'src/app/servicios/tipo-documento-cartera.service';
import { TipoRetencionService } from 'src/app/servicios/tipo-retencion.service';
import { MesService } from 'src/app/servicios/mes.service';
import { ProvinciaService } from 'src/app/servicios/provincia.service';
import { TesoreriaCompartidoModule } from 'src/app/compartidos/tesoreria.compartido.module';

@NgModule({
  declarations: [
    OrdenPagoComponent
  ],
  imports: [
    OrdenPagoRoutingModule,
    TesoreriaCompartidoModule
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
  ]
})
export class OrdenPagoModule { }