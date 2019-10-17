import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, MatSelectModule, MatProgressBarModule, MatButtonModule, MatDialogModule, MatDividerModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { RepartoComprobante } from 'src/app/modelos/repartoComprobante';
import { TipoComprobanteService } from 'src/app/servicios/tipo-comprobante.service';
import { OrdenRecoleccionService } from 'src/app/servicios/orden-recoleccion.service';
import { ViajeRemitoService } from 'src/app/servicios/viaje-remito.service';
import { RepartoComprobanteService } from 'src/app/servicios/reparto-comprobante.service';
import { VentaComprobanteService } from 'src/app/servicios/venta-comprobante.service';
import { SeguimientoOrdenRecoleccionService } from 'src/app/servicios/seguimiento-orden-recoleccion.service';
import { SeguimientoViajeRemitoService } from 'src/app/servicios/seguimiento-viaje-remito.service';
import { SeguimientoVentaComprobanteService } from 'src/app/servicios/seguimiento-venta-comprobante.service';
import { EliminarRepartoCpteDialogo, RepartoComprobanteComponent } from 'src/app/componentes/reparto-comprobante/reparto-comprobante.component';
import { RepartoComprobanteRoutingModule } from './reparto-comprobante-routing-module';
@NgModule({
  declarations: [
    RepartoComprobanteComponent,
    EliminarRepartoCpteDialogo
  ],
  imports: [
    CommonModule,
    RepartoComprobanteRoutingModule,
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
    RepartoComprobante,
    TipoComprobanteService,
    OrdenRecoleccionService,
    ViajeRemitoService,
    RepartoComprobanteService,
    VentaComprobanteService,
    SeguimientoOrdenRecoleccionService,
    SeguimientoViajeRemitoService,
    SeguimientoVentaComprobanteService,
    
  ],
  entryComponents: [
    EliminarRepartoCpteDialogo
  ]
})
export class RepartoComprobanteModule { }
