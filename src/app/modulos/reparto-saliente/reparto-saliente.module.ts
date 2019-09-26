import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RepartoSalienteRoutingModule } from './reparto-saliente-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatButtonModule, MatDialogModule, MatDividerModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RepartoComponent, AcompanianteDialogo } from 'src/app/componentes/reparto-saliente/reparto.component';
import { Reparto } from 'src/app/modelos/reparto';
import { TextMaskModule } from 'angular2-text-mask';
import { VehiculoService } from 'src/app/servicios/vehiculo.service';
import { VehiculoProveedorService } from 'src/app/servicios/vehiculo-proveedor.service';
import { PersonalService } from 'src/app/servicios/personal.service';
import { ChoferProveedorService } from 'src/app/servicios/chofer-proveedor.service';
import { RetiroDepositoService } from 'src/app/servicios/retiro-deposito.service';
import { FechaService } from 'src/app/servicios/fecha.service';
import { RetiroDepositoComprobanteService } from 'src/app/servicios/retiro-deposito-comprobante.service';
import { TipoComprobanteService } from 'src/app/servicios/tipo-comprobante.service';
import { RepartoComprobante } from 'src/app/modelos/repartoComprobante';
import { RepartoPersonal } from 'src/app/modelos/repartoPersonal';
import { Seguimiento } from 'src/app/modelos/seguimiento';
import { ViajeCombustible } from 'src/app/modelos/viajeCombustible';
import { ViajeEfectivo } from 'src/app/modelos/viajeEfectivo';
import { ZonaService } from 'src/app/servicios/zona.service';
import { RepartoService } from 'src/app/servicios/reparto.service';

@NgModule({
  declarations: [
    RepartoComponent,
    AcompanianteDialogo,
  ],
  imports: [
    CommonModule,
    RepartoSalienteRoutingModule,
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
    Reparto,
    RepartoComprobante,
    RepartoPersonal,
    Seguimiento,
    ViajeCombustible,
    ViajeEfectivo,
    VehiculoService,
    VehiculoProveedorService,
    PersonalService,
    ChoferProveedorService,
    RepartoService,
    RetiroDepositoService,
    FechaService,
    ZonaService,
    RetiroDepositoComprobanteService,
    TipoComprobanteService,
  ],
  entryComponents: [
    AcompanianteDialogo,
  ]
})
export class RepartoSalienteModule { }
