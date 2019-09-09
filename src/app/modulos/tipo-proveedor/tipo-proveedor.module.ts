import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TipoProveedorRoutingModule } from './tipo-proveedor-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TipoProveedorComponent } from 'src/app/componentes/tipo-proveedor/tipo-proveedor.component';
import { TipoProveedorService } from 'src/app/servicios/tipo-proveedor.service';

@NgModule({
  declarations: [
    TipoProveedorComponent,
  ],
  imports: [
    CommonModule,
    TipoProveedorRoutingModule,
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
    TipoProveedorService
  ]
})
export class TipoProveedorModule { }
