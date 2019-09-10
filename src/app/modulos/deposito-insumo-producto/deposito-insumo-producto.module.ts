import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DepositoInsumoProductoRoutingModule } from './deposito-insumo-producto-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatButtonModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DepositoInsumoProductoComponent } from 'src/app/componentes/deposito-insumo-producto/deposito-insumo-producto.component';
import { DepositoInsumoProductoService } from 'src/app/servicios/deposito-insumo-producto.service';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { DepositoInsumoProducto } from 'src/app/modelos/depositoInsumoProducto';

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
    MatProgressBarModule,
    MatButtonModule
  ],
  providers: [
    DepositoInsumoProductoService,
    SubopcionPestaniaService,
    DepositoInsumoProducto
  ]
})
export class DepositoInsumoProductoModule { }
