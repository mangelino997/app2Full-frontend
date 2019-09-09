import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfiguracionVehiculoRoutingModule } from './configuracion-vehiculo-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfiguracionVehiculoComponent } from 'src/app/componentes/configuracion-vehiculo/configuracion-vehiculo.component';
import { TextMaskModule } from 'angular2-text-mask';
import { ConfiguracionVehiculoService } from 'src/app/servicios/configuracion-vehiculo.service';

@NgModule({
  declarations: [
    ConfiguracionVehiculoComponent,
  ],
  imports: [
    CommonModule,
    ConfiguracionVehiculoRoutingModule,
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
    ConfiguracionVehiculoService
  ]
})
export class ConfiguracionVehiculoModule { }
