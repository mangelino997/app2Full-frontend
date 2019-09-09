import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TipoVehiculoRoutingModule } from './tipo-vehiculo-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TipoVehiculoComponent } from 'src/app/componentes/tipo-vehiculo/tipo-vehiculo.component';
import { TipoVehiculoService } from 'src/app/servicios/tipo-vehiculo.service';

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
    MatProgressBarModule
  ],
  providers: [
    TipoVehiculoService
  ]
})
export class TipoVehiculoModule { }
