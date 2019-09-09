import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChoferProveedorRoutingModule } from './chofer-proveedor-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChoferProveedorComponent } from 'src/app/componentes/chofer-proveedor/chofer-proveedor.component';
import { ChoferProveedorService } from 'src/app/servicios/chofer-proveedor.service';

@NgModule({
  declarations: [
    ChoferProveedorComponent,
  ],
  imports: [
    CommonModule,
    ChoferProveedorRoutingModule,
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
    ChoferProveedorService
  ]
})
export class ChoferProveedorModule { }
