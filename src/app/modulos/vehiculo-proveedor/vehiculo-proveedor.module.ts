import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VehiculoProveedorRoutingModule } from './vehiculo-proveedor-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatButtonModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VehiculoProveedorComponent } from 'src/app/componentes/vehiculo-proveedor/vehiculo-proveedor.component';
import { TextMaskModule } from 'angular2-text-mask';
import { VehiculoProveedorService } from 'src/app/servicios/vehiculo-proveedor.service';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { TipoVehiculoService } from 'src/app/servicios/tipo-vehiculo.service';
import { MarcaVehiculoService } from 'src/app/servicios/marca-vehiculo.service';
import { ProveedorService } from 'src/app/servicios/proveedor.service';
import { CompaniaSeguroService } from 'src/app/servicios/compania-seguro.service';
import { ChoferProveedorService } from 'src/app/servicios/chofer-proveedor.service';
import { ConfiguracionVehiculoService } from 'src/app/servicios/configuracion-vehiculo.service';

@NgModule({
  declarations: [
    VehiculoProveedorComponent,
  ],
  imports: [
    CommonModule,
    VehiculoProveedorRoutingModule,
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
    VehiculoProveedorService,
    SubopcionPestaniaService,
    TipoVehiculoService,
    MarcaVehiculoService,
    ProveedorService,
    CompaniaSeguroService,
    ChoferProveedorService,
    ConfiguracionVehiculoService
  ]
})
export class VehiculoProveedorModule { }