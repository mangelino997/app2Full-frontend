import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RepartoEntranteRoutingModule } from './reparto-entrante-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatButtonModule, MatDialogModule, MatDividerModule, MatIconModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RepartoEntranteComponent } from 'src/app/componentes/reparto-entrante/reparto-entrante.component';
import { TextMaskModule } from 'angular2-text-mask';
import { Reparto } from 'src/app/modelos/reparto';
import { SeguimientoOrdenRecoleccionService } from 'src/app/servicios/seguimiento-orden-recoleccion.service';
import { SeguimientoViajeRemitoService } from 'src/app/servicios/seguimiento-viaje-remito.service';
import { SeguimientoVentaComprobanteService } from 'src/app/servicios/seguimiento-venta-comprobante.service';
import { OrdenRecoleccionService } from 'src/app/servicios/orden-recoleccion.service';
import { ViajeRemitoService } from 'src/app/servicios/viaje-remito.service';
import { RepartoComprobanteService } from 'src/app/servicios/reparto-comprobante.service';

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
    MatIconModule
  ],
  providers: [
    Reparto,
    SeguimientoOrdenRecoleccionService,
    SeguimientoViajeRemitoService,
    SeguimientoVentaComprobanteService,
    OrdenRecoleccionService,
    ViajeRemitoService,
    RepartoComprobanteService,

  ],
  entryComponents: [
    
  ]
})
export class RepartoEntranteModule { }
