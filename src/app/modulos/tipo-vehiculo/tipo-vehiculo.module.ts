import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TipoVehiculoRoutingModule } from './tipo-vehiculo-routing.module';

import {
  MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule,
  MatSelectModule, MatProgressBarModule, MatButtonModule, MatIconModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TipoVehiculoComponent } from 'src/app/componentes/tipo-vehiculo/tipo-vehiculo.component';
import { TipoVehiculoService } from 'src/app/servicios/tipo-vehiculo.service';
import { TipoVehiculo } from 'src/app/modelos/tipoVehiculo';

@NgModule({
  declarations: [
    TipoVehiculoComponent,
  ],
  imports: [
    CommonModule,
    TipoVehiculoRoutingModule,
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
    TipoVehiculoService,
    TipoVehiculo
  ]
})
export class TipoVehiculoModule { }
