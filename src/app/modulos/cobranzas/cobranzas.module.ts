import { NgModule } from '@angular/core';

import { CobranzasRoutingModule } from './cobranzas-routing.module';
import { CobranzasComponent } from 'src/app/componentes/cobranzas/cobranzas.component';
import { CobranzaService } from 'src/app/servicios/cobranza.service';
import { TesoreriaModule } from 'src/app/shared/tesoreria.module';

@NgModule({
  declarations: [
    CobranzasComponent
  ],
  imports: [
    CobranzasRoutingModule,
    TesoreriaModule
  ],
  providers: [
    CobranzaService
  ],
  entryComponents: [],
})
export class CobranzasModule { }
