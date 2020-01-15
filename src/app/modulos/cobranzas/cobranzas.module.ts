import { NgModule } from '@angular/core';

import { CobranzasRoutingModule } from './cobranzas-routing.module';
import { CobranzasComponent, ClienteGrupoDialogo } from 'src/app/componentes/cobranzas/cobranzas.component';
import { CobranzaService } from 'src/app/servicios/cobranza.service';
import { Cobranza } from 'src/app/modelos/cobranza';
import { CobranzaMedioPago } from 'src/app/modelos/cobranzaMedioPago';
import { CobranzaItem } from 'src/app/modelos/cobranzaItem';
import { CommonModule } from '@angular/common';
import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, MatSelectModule, MatProgressBarModule, MatCheckboxModule, MatIconModule, MatButtonModule, MatDialogModule, MatRadioModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { CobranzaMedioPagoService } from 'src/app/servicios/cobranza-medio-pago.service';
import { CobranzaAnticiposService } from 'src/app/servicios/cobranza-anticipos.service';
import { CobranzaAnticipoComponent } from 'src/app/componentes/cobranzas/cobranza-anticipo/cobranza-anticipo.component';
import { CobranzaChequesCarteraComponent } from 'src/app/componentes/cobranzas/cobranza-cheques-cartera/cobranza-cheques-cartera.component';
import { CobranzaChequesElectronicosComponent } from 'src/app/componentes/cobranzas/cobranza-cheques-electronicos/cobranza-cheques-electronicos.component';
import { CobranzaChequesPropiosComponent } from 'src/app/componentes/cobranzas/cobranza-cheques-propios/cobranza-cheques-propios.component';
import { CobranzaDocumentosCarteraComponent } from 'src/app/componentes/cobranzas/cobranza-documentos-cartera/cobranza-documentos-cartera.component';
import { CobranzaEfectivoComponent } from 'src/app/componentes/cobranzas/cobranza-efectivo/cobranza-efectivo.component';
import { CobranzaOtrasCuentasComponent } from 'src/app/componentes/cobranzas/cobranza-otras-cuentas/cobranza-otras-cuentas.component';
import { CobranzaOtrasMonedasComponent } from 'src/app/componentes/cobranzas/cobranza-otras-monedas/cobranza-otras-monedas.component';
import { CobranzaTransferenciaBancariaComponent } from 'src/app/componentes/cobranzas/cobranza-transferencia-bancaria/cobranza-transferencia-bancaria.component';


@NgModule({
  declarations: [
    CobranzasComponent,
    ClienteGrupoDialogo,
    CobranzaAnticipoComponent,
    CobranzaChequesCarteraComponent,
    CobranzaChequesElectronicosComponent,
    CobranzaChequesPropiosComponent,
    CobranzaDocumentosCarteraComponent,
    CobranzaEfectivoComponent,
    CobranzaOtrasCuentasComponent,
    CobranzaOtrasMonedasComponent,
    CobranzaTransferenciaBancariaComponent,
  ],
  imports: [
    CobranzasRoutingModule,
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
    CobranzaItem,
    CobranzaAnticiposService
  ],
  entryComponents: [
    ClienteGrupoDialogo,
    CobranzaAnticipoComponent,
    CobranzaChequesCarteraComponent,
    CobranzaChequesElectronicosComponent,
    CobranzaChequesPropiosComponent,
    CobranzaDocumentosCarteraComponent,
    CobranzaEfectivoComponent,
    CobranzaOtrasCuentasComponent,
    CobranzaOtrasMonedasComponent,
    CobranzaTransferenciaBancariaComponent,
   ],
})
export class CobranzasModule { }
