import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VehiculoRoutingModule } from './vehiculo-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VehiculoComponent } from 'src/app/componentes/vehiculo/vehiculo.component';
import { TextMaskModule } from 'angular2-text-mask';
import { VehiculoService } from 'src/app/servicios/vehiculo.service';
import { Vehiculo } from 'src/app/modelos/vehiculo';

@NgModule({
  declarations: [
    VehiculoComponent,
  ],
  imports: [
    CommonModule,
    VehiculoRoutingModule,
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
    VehiculoService,
    Vehiculo
  ]
})
export class VehiculoModule { }
