import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfiguracionVehiculoRoutingModule } from './configuracion-vehiculo-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatButtonModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfiguracionVehiculoComponent } from 'src/app/componentes/configuracion-vehiculo/configuracion-vehiculo.component';
import { TextMaskModule } from 'angular2-text-mask';
import { ConfiguracionVehiculoService } from 'src/app/servicios/configuracion-vehiculo.service';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { TipoVehiculoService } from 'src/app/servicios/tipo-vehiculo.service';
import { MarcaVehiculoService } from 'src/app/servicios/marca-vehiculo.service';
import { configuracionVehiculo } from 'src/app/modelos/configuracionVehiculo';

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
    MatButtonModule,
    TextMaskModule
  ],
  providers: [
    ConfiguracionVehiculoService,
    SubopcionPestaniaService,
    TipoVehiculoService,
    MarcaVehiculoService,
    configuracionVehiculo
  ]
})
export class ConfiguracionVehiculoModule { }
