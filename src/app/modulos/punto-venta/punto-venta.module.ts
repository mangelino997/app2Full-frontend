import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PuntoVentaRoutingModule } from './punto-venta-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PuntoVentaComponent } from 'src/app/componentes/punto-venta/punto-venta.component';
import { TextMaskModule } from 'angular2-text-mask';
import { PuntoVentaService } from 'src/app/servicios/punto-venta.service';

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
    TextMaskModule
  ],
  providers: [
    PuntoVentaService
  ]
})
export class PuntoVentaModule { }
