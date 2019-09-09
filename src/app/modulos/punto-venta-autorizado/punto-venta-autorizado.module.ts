import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PuntoVentaAutorizadoRoutingModule } from './punto-venta-autorizado-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PuntosVentaAutorizadoComponent } from 'src/app/componentes/puntos-venta-autorizado/puntos-venta-autorizado.component';

@NgModule({
  declarations: [
    PuntosVentaAutorizadoComponent,
  ],
  imports: [
    CommonModule,
    PuntoVentaAutorizadoRoutingModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatProgressBarModule
  ]
})
export class PuntoVentaAutorizadoModule { }
