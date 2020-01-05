import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdenPagoRoutingModule } from './orden-pago-routing.module';
import { OrdenPagoComponent } from 'src/app/componentes/orden-pago/orden-pago.component';
import { OrdenPagoService } from 'src/app/servicios/orden-pago.service';
import { OrdenPago } from 'src/app/modelos/orden-pago';
import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatButtonModule, MatIconModule, MatTooltipModule, 
  MatListModule, MatDialogModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AnticiposComponent } from 'src/app/componentes/orden-pago/anticipos/anticipos.component';
import { EfectivoComponent } from 'src/app/componentes/orden-pago/efectivo/efectivo.component';
import { ChequesPropiosComponent } from 'src/app/componentes/orden-pago/cheques-propios/cheques-propios.component';
import { ChequesCarteraComponent } from 'src/app/componentes/orden-pago/cheques-cartera/cheques-cartera.component';
import { ChequesElectronicosComponent } from 'src/app/componentes/orden-pago/cheques-electronicos/cheques-electronicos.component';
import { TransferenciaBancariaComponent } from 'src/app/componentes/orden-pago/transferencia-bancaria/transferencia-bancaria.component';
import { DocumentosComponent } from 'src/app/componentes/orden-pago/documentos/documentos.component';
import { OtrasCuentasComponent } from 'src/app/componentes/orden-pago/otras-cuentas/otras-cuentas.component';
import { OtrasMonedasComponent } from 'src/app/componentes/orden-pago/otras-monedas/otras-monedas.component';

@NgModule({
  declarations: [
    OrdenPagoComponent,
    AnticiposComponent,
    EfectivoComponent,
    ChequesPropiosComponent,
    ChequesCarteraComponent,
    ChequesElectronicosComponent,
    TransferenciaBancariaComponent,
    DocumentosComponent,
    OtrasCuentasComponent,
    OtrasMonedasComponent
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
    MatDialogModule
  ],
  providers: [
    OrdenPagoService,
    OrdenPago
  ],
  entryComponents: [
    AnticiposComponent,
    EfectivoComponent,
    ChequesPropiosComponent,
    ChequesCarteraComponent,
    ChequesElectronicosComponent,
    TransferenciaBancariaComponent,
    DocumentosComponent,
    OtrasCuentasComponent,
    OtrasMonedasComponent
  ]
})
export class OrdenPagoModule { }