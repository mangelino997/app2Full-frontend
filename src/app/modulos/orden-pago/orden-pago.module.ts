import { NgModule } from '@angular/core';

import { OrdenPagoRoutingModule } from './orden-pago-routing.module';
import { OrdenPagoComponent } from 'src/app/componentes/orden-pago/orden-pago.component';
import { OrdenPagoService } from 'src/app/servicios/orden-pago.service';
import { OrdenPago } from 'src/app/modelos/orden-pago';
import { CompraComprobanteService } from 'src/app/servicios/compra-comprobante.service';
import { TesoreriaModule } from 'src/app/shared/tesoreria.module';

@NgModule({
  declarations: [
    OrdenPagoComponent,
  ],
  imports: [
    OrdenPagoRoutingModule,
    TesoreriaModule
  ],
  providers: [
    OrdenPagoService,
    OrdenPago,
    CompraComprobanteService
  ],
  entryComponents: []
})
export class OrdenPagoModule { }