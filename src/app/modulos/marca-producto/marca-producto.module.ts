import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MarcaProductoRoutingModule } from './marca-producto-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MarcaProductoComponent } from 'src/app/componentes/marca-producto/marca-producto.component';
import { MarcaProductoService } from 'src/app/servicios/marca-producto.service';

@NgModule({
  declarations: [
    MarcaProductoComponent,
  ],
  imports: [
    CommonModule,
    MarcaProductoRoutingModule,
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
    MarcaProductoService
  ]
})
export class MarcaProductoModule { }
