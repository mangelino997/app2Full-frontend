import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnticiposComponent } from '../componentes/tesoreria/anticipos/anticipos.component';
import { ChequesCarteraComponent } from '../componentes/tesoreria/cheques-cartera/cheques-cartera.component';
import { ChequesElectronicosComponent } from '../componentes/tesoreria/cheques-electronicos/cheques-electronicos.component';
import { ChequesPropiosComponent } from '../componentes/tesoreria/cheques-propios/cheques-propios.component';
import { ComprobanteComponent } from '../componentes/tesoreria/comprobante/comprobante.component';
import { DetalleRetencionesComponent } from '../componentes/tesoreria/detalle-retenciones/detalle-retenciones.component';
import { DocumentosComponent } from '../componentes/tesoreria/documentos/documentos.component';
import { EfectivoComponent } from '../componentes/tesoreria/efectivo/efectivo.component';
import { OtrasCuentasComponent } from '../componentes/tesoreria/otras-cuentas/otras-cuentas.component';
import { OtrasMonedasComponent } from '../componentes/tesoreria/otras-monedas/otras-monedas.component';
import { TransferenciaBancariaComponent } from '../componentes/tesoreria/transferencia-bancaria/transferencia-bancaria.component';
import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, MatSelectModule, MatProgressBarModule, MatButtonModule, MatIconModule, MatTooltipModule, MatListModule, MatDialogModule, MatCheckboxModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { PagoParcialComponent } from '../componentes/tesoreria/pago-parcial/pago-parcial.component';

@NgModule({
  declarations: [
    AnticiposComponent,
    ChequesCarteraComponent,
    ChequesElectronicosComponent,
    ChequesPropiosComponent,
    ComprobanteComponent,
    DetalleRetencionesComponent,
    DocumentosComponent,
    EfectivoComponent,
    OtrasCuentasComponent,
    OtrasMonedasComponent,
    TransferenciaBancariaComponent,
    PagoParcialComponent
  ],
  imports: [
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
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatListModule,
    MatDialogModule,
    TextMaskModule,
    MatCheckboxModule,
  ],
  exports: [
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
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatListModule,
    MatDialogModule,
    TextMaskModule,
    MatCheckboxModule,
  ],
  entryComponents: [
    AnticiposComponent,
    ChequesCarteraComponent,
    ChequesElectronicosComponent,
    ChequesPropiosComponent,
    ComprobanteComponent,
    DetalleRetencionesComponent,
    DocumentosComponent,
    EfectivoComponent,
    OtrasCuentasComponent,
    OtrasMonedasComponent,
    TransferenciaBancariaComponent,
    PagoParcialComponent
  ]
})
export class TesoreriaCompartidoModule { }
