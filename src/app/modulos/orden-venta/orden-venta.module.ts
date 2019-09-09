import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdenVentaRoutingModule } from './orden-venta-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatIconModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrdenVentaComponent } from 'src/app/componentes/orden-venta/orden-venta.component';
import { TextMaskModule } from 'angular2-text-mask';
import { OrdenVentaService } from 'src/app/servicios/orden-venta.service';
import { OrdenVentaEscalaService } from 'src/app/servicios/orden-venta-escala.service';
import { OrdenVentaTramo } from 'src/app/modelos/ordenVentaTramo';
import { OrdenVentaTarifaService } from 'src/app/servicios/orden-venta-tarifa.service';
import { OrdenVenta } from 'src/app/modelos/ordenVenta';
import { OrdenVentaEscala } from 'src/app/modelos/ordenVentaEscala';

@NgModule({
  declarations: [
    OrdenVentaComponent,
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
    MatIconModule
  ],
  providers: [
    OrdenVentaService,
    OrdenVentaEscalaService,
    OrdenVentaTramo,
    OrdenVentaTarifaService,
    OrdenVenta,
    OrdenVentaEscala,
    OrdenVentaTramo
  ]
})
export class OrdenVentaModule { }
