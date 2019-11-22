import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CostosInsumosProductoRoutingModule } from './costos-insumos-producto-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatDividerModule, MatIconModule, MatButtonModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CostosInsumosProductoComponent } from 'src/app/componentes/costos-insumos-producto/costos-insumos-producto.component';
import { TextMaskModule } from 'angular2-text-mask';
import { InsumoProductoService } from 'src/app/servicios/insumo-producto.service';
import { InsumoProducto } from 'src/app/modelos/insumoProducto';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { RubroProductoService } from 'src/app/servicios/rubro-producto.service';
import { MarcaProductoService } from 'src/app/servicios/marca-producto.service';
import { UnidadMedidaService } from 'src/app/servicios/unidad-medida.service';
import { CostoInsumoProducto } from 'src/app/modelos/costoInsumoProducto';

@NgModule({
  declarations: [
    CostosInsumosProductoComponent,
  ],
  imports: [
    CommonModule,
    CostosInsumosProductoRoutingModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatProgressBarModule,
    MatDividerModule,
    TextMaskModule,
    MatIconModule,
    MatButtonModule,
  ],
  providers: [
    InsumoProductoService,
    CostoInsumoProducto,
    SubopcionPestaniaService,
    RubroProductoService,
    MarcaProductoService,
    UnidadMedidaService
  ]
})
export class CostosInsumosProductoModule { }
