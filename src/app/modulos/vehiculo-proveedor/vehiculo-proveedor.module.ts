import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VehiculoProveedorRoutingModule } from './vehiculo-proveedor-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VehiculoProveedorComponent } from 'src/app/componentes/vehiculo-proveedor/vehiculo-proveedor.component';
import { TextMaskModule } from 'angular2-text-mask';
import { VehiculoProveedorService } from 'src/app/servicios/vehiculo-proveedor.service';

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
    TextMaskModule
  ],
  providers: [
    VehiculoProveedorService
  ]
})
export class VehiculoProveedorModule { }
