import { NgModule } from '@angular/core';

import { CobranzasRoutingModule } from './cobranzas-routing.module';
import { CobranzasComponent, ClienteGrupoDialogo } from 'src/app/componentes/cobranzas/cobranzas.component';
import { CobranzaService } from 'src/app/servicios/cobranza.service';
import { TesoreriaModule } from 'src/app/shared/tesoreria.module';
import { Cobranza } from 'src/app/modelos/cobranza';
import { CobranzaMedioPago } from 'src/app/modelos/cobranzaMedioPago';
import { CobranzaItem } from 'src/app/modelos/cobranzaItem';
import { CommonModule } from '@angular/common';
import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, MatSelectModule, MatProgressBarModule, MatCheckboxModule, MatIconModule, MatButtonModule, MatDialogModule, MatRadioModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { CobranzaMedioPagoService } from 'src/app/servicios/cobranza-medio-pago.service';
import { CobranzaItemComponent } from 'src/app/componentes/cobranzas/cobranza-item/cobranza-item.component';

@NgModule({
  declarations: [
    CobranzasComponent,
    ClienteGrupoDialogo,
    CobranzaItemComponent
  ],
  imports: [
    CobranzasRoutingModule,
    TesoreriaModule,
    CommonModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatProgressBarModule,
    MatCheckboxModule,
    MatIconModule,
    TextMaskModule,
    MatButtonModule,
    MatDialogModule,
    MatRadioModule,
  ],
  providers: [
    CobranzaService,
    CobranzaMedioPagoService,
    Cobranza,
    CobranzaMedioPago,
    CobranzaItem
  ],
  entryComponents: [
    ClienteGrupoDialogo,
    CobranzaItemComponent
  ],
})
export class CobranzasModule { }
