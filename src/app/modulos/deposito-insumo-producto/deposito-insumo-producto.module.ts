import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DepositoInsumoProductoRoutingModule } from './deposito-insumo-producto-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DepositoInsumoProductoComponent } from 'src/app/componentes/deposito-insumo-producto/deposito-insumo-producto.component';
import { DepositoInsumoProductoService } from 'src/app/servicios/deposito-insumo-producto.service';

@NgModule({
  declarations: [
    DepositoInsumoProductoComponent,
  ],
  imports: [
    CommonModule,
    DepositoInsumoProductoRoutingModule,
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
    DepositoInsumoProductoService
  ]
})
export class DepositoInsumoProductoModule { }
