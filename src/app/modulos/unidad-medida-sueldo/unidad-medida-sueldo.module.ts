import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UnidadMedidaSueldoRoutingModule } from './unidad-medida-sueldo-routing.module';
import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, MatSelectModule, MatProgressBarModule, MatButtonModule, MatIconModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UnidadMedidaSueldoComponent } from 'src/app/componentes/unidad-medida-sueldo/unidad-medida-sueldo.component';


@NgModule({
  declarations: [
    UnidadMedidaSueldoComponent
  ],
  imports: [
    CommonModule,
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
    MatIconModule,
    UnidadMedidaSueldoRoutingModule
  ]
})
export class UnidadMedidaSueldoModule { }
