import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViajeUnidadNegocioRoutingModule } from './viaje-unidad-negocio-routing.module';

import {
  MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule,
  MatSelectModule, MatProgressBarModule, MatButtonModule, MatIconModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViajeUnidadNegocioComponent } from 'src/app/componentes/viaje-unidad-negocio/viaje-unidad-negocio.component';
import { ViajeUnidadNegocioService } from 'src/app/servicios/viaje-unidad-negocio.service';
import { ViajeUnidadNegocio } from 'src/app/modelos/viajeUnidadNegocio';

@NgModule({
  declarations: [
    ViajeUnidadNegocioComponent,
  ],
  imports: [
    CommonModule,
    ViajeUnidadNegocioRoutingModule,
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
    MatIconModule
  ],
  providers: [
    ViajeUnidadNegocioService,
    ViajeUnidadNegocio,
  ]
})
export class ViajeUnidadNegocioModule { }
