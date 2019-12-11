import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MarcaVehiculoRoutingModule } from './marca-vehiculo-routing.module';

import {
  MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule,
  MatSelectModule, MatProgressBarModule, MatButtonModule, MatIconModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MarcaVehiculoComponent } from 'src/app/componentes/marca-vehiculo/marca-vehiculo.component';
import { MarcaVehiculoService } from 'src/app/servicios/marca-vehiculo.service';

@NgModule({
  declarations: [
    MarcaVehiculoComponent,
  ],
  imports: [
    CommonModule,
    MarcaVehiculoRoutingModule,
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
    MarcaVehiculoService,
  ]
})
export class MarcaVehiculoModule { }
