import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdenVentaRoutingModule } from './orden-venta-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatIconModule, MatButtonModule, MatDialogModule, MatTooltipModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrdenVentaComponent, VerTarifaDialogo } from 'src/app/componentes/orden-venta/orden-venta.component';
import { TextMaskModule } from 'angular2-text-mask';
import { OrdenVentaService } from 'src/app/servicios/orden-venta.service';
import { OrdenVentaEscalaService } from 'src/app/servicios/orden-venta-escala.service';
import { OrdenVentaTramo } from 'src/app/modelos/ordenVentaTramo';
import { OrdenVentaTarifaService } from 'src/app/servicios/orden-venta-tarifa.service';
import { OrdenVenta } from 'src/app/modelos/ordenVenta';
import { OrdenVentaEscala } from 'src/app/modelos/ordenVentaEscala';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { ClienteService } from 'src/app/servicios/cliente.service';
import { VendedorService } from 'src/app/servicios/vendedor.service';
import { TipoTarifaService } from 'src/app/servicios/tipo-tarifa.service';
import { OrdenVentaTarifa } from 'src/app/modelos/ordenVentaTarifa';
import { OrdenVentaTramoService } from 'src/app/servicios/orden-venta-tramo.service';
import { EscalaTarifaService } from 'src/app/servicios/escala-tarifa.service';
import { TramoService } from 'src/app/servicios/tramo.service';

@NgModule({
  declarations: [
    OrdenVentaComponent,
    VerTarifaDialogo
  ],
  imports: [
    CommonModule,
    OrdenVentaRoutingModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatProgressBarModule,
    TextMaskModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatTooltipModule
  ],
  providers: [
    OrdenVentaService,
    OrdenVentaEscalaService,
    OrdenVentaTramo,
    OrdenVentaTarifaService,
    OrdenVenta,
    OrdenVentaEscala,
    OrdenVentaTramo,
    SubopcionPestaniaService,
    ClienteService,
    VendedorService,
    TipoTarifaService,
    OrdenVentaTarifa,
    OrdenVentaTarifaService,
    OrdenVentaTramoService,
    EscalaTarifaService,
    TramoService
  ],
  entryComponents: [
    VerTarifaDialogo
  ]
})
export class OrdenVentaModule { }
