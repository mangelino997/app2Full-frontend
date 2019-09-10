import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PuntoVentaRoutingModule } from './punto-venta-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatButtonModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PuntoVentaComponent } from 'src/app/componentes/punto-venta/punto-venta.component';
import { TextMaskModule } from 'angular2-text-mask';
import { PuntoVentaService } from 'src/app/servicios/punto-venta.service';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { PuntoVenta } from 'src/app/modelos/puntoVenta';
import { SucursalService } from 'src/app/servicios/sucursal.service';
import { EmpresaService } from 'src/app/servicios/empresa.service';
import { AfipComprobanteService } from 'src/app/servicios/afip-comprobante.service';
import { TipoComprobanteService } from 'src/app/servicios/tipo-comprobante.service';

@NgModule({
  declarations: [
    PuntoVentaComponent,
  ],
  imports: [
    CommonModule,
    PuntoVentaRoutingModule,
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
    TextMaskModule
  ],
  providers: [
    PuntoVentaService,
    SubopcionPestaniaService,
    PuntoVenta,
    SucursalService,
    EmpresaService,
    AfipComprobanteService,
    TipoComprobanteService
  ]
})
export class PuntoVentaModule { }
