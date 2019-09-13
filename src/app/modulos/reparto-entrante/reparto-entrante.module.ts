import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RepartoEntranteRoutingModule } from './reparto-entrante-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatButtonModule, MatDialogModule, MatDividerModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RepartoEntranteComponent } from 'src/app/componentes/reparto-entrante/reparto-entrante.component';
import { RepartoEntrante } from 'src/app/modelos/repartoEntrante';
import { TextMaskModule } from 'angular2-text-mask';
import { RepartoPropioService } from 'src/app/servicios/reparto-propio.service';
import { RepartoTerceroService } from 'src/app/servicios/reparto-tercero.service';
import { RetiroDepositoComprobanteService } from 'src/app/servicios/retiro-deposito-comprobante.service';
import { RepartoTerceroComprobanteService } from 'src/app/servicios/reparto-tercero-comprobante.service';
import { RepartoPropioComprobanteService } from 'src/app/servicios/reparto-propio-comprobante.service';
import { FechaService } from 'src/app/servicios/fecha.service';
import { RetiroDepositoService } from 'src/app/servicios/retiro-deposito.service';
import { PersonalService } from 'src/app/servicios/personal.service';

@NgModule({
  declarations: [
    RepartoEntranteComponent,
  ],
  imports: [
    CommonModule,
    RepartoEntranteRoutingModule,
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
    RepartoEntrante,
    RepartoPropioService,
    RepartoTerceroService,
    RetiroDepositoService,
    FechaService,
    RepartoPropioComprobanteService,
    RepartoTerceroComprobanteService,
    RetiroDepositoComprobanteService,

  ],
  entryComponents: [
    
  ]
})
export class RepartoEntranteModule { }
