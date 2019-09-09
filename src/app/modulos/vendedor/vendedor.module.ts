import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VendedorRoutingModule } from './vendedor-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VendedorComponent } from 'src/app/componentes/vendedor/vendedor.component';
import { VendedorService } from 'src/app/servicios/vendedor.service';

@NgModule({
  declarations: [
    VendedorComponent,
  ],
  imports: [
    CommonModule,
    VendedorRoutingModule,
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
    VendedorService
  ]
})
export class VendedorModule { }
