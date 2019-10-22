import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RepartoSalienteRoutingModule } from './reparto-saliente-routing.module';

import {
  MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule,
  MatSelectModule, MatProgressBarModule, MatButtonModule, MatDialogModule, MatDividerModule, MatIconModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RepartoComponent, AcompanianteDialogo, CerrarRepartoDialogo, EliminarRepartoDialogo } from 'src/app/componentes/reparto-saliente/reparto.component';
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
import { RepartoPersonal } from 'src/app/modelos/repartoPersonal';
import { Seguimiento } from 'src/app/modelos/seguimiento';
import { ZonaService } from 'src/app/servicios/zona.service';
import { RepartoService } from 'src/app/servicios/reparto.service';
import { RepartoDTO } from 'src/app/modelos/repartoDTO';
import { OrdenRecoleccionService } from 'src/app/servicios/orden-recoleccion.service';
import { ViajeRemitoService } from 'src/app/servicios/viaje-remito.service';
import { VentaComprobanteService } from 'src/app/servicios/venta-comprobante.service';
import { AfipComprobanteService } from 'src/app/servicios/afip-comprobante.service';
import { SeguimientoOrdenRecoleccionService } from 'src/app/servicios/seguimiento-orden-recoleccion.service';
import { SeguimientoViajeRemitoService } from 'src/app/servicios/seguimiento-viaje-remito.service';
import { SeguimientoVentaComprobanteService } from 'src/app/servicios/seguimiento-venta-comprobante.service';
import { EliminarRepartoCpteDialogo,  } from 'src/app/componentes/reparto-comprobante/reparto-comprobante.component';

@NgModule({
  declarations: [
    RepartoComponent,
    AcompanianteDialogo,
    CerrarRepartoDialogo,
    EliminarRepartoCpteDialogo,
    EliminarRepartoDialogo,
    // RepartoComprobanteComponent
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
    MatIconModule
  ],
  providers: [
    Reparto,
    // RepartoComprobante,
    RepartoPersonal,
    Seguimiento,
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
    RepartoDTO,
    OrdenRecoleccionService,
    ViajeRemitoService,
    // RepartoComprobanteService,
    VentaComprobanteService,
    AfipComprobanteService,
    SeguimientoOrdenRecoleccionService,
    SeguimientoViajeRemitoService,
    SeguimientoVentaComprobanteService,

  ],
  entryComponents: [
    AcompanianteDialogo,
    CerrarRepartoDialogo,
    EliminarRepartoCpteDialogo,
    EliminarRepartoDialogo,
    // RepartoComprobanteComponent

  ]
})
export class RepartoSalienteModule { }
