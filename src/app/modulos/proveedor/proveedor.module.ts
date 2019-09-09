import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProveedorRoutingModule } from './proveedor-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatSidenavModule, MatIconModule, MatDividerModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProveedorComponent } from 'src/app/componentes/proveedor/proveedor.component';
import { TextMaskModule } from 'angular2-text-mask';
import { ProveedorService } from 'src/app/servicios/proveedor.service';
import { Proveedor } from 'src/app/modelos/proveedor';

@NgModule({
  declarations: [
    ProveedorComponent,
  ],
  imports: [
    CommonModule,
    ProveedorRoutingModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatProgressBarModule,
    MatSidenavModule,
    MatIconModule,
    MatDividerModule,
    TextMaskModule
  ],
  providers: [
    ProveedorService,
    Proveedor
  ]
})
export class ProveedorModule { }
