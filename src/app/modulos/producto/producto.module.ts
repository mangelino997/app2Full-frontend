import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductoRoutingModule } from './producto-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatButtonModule, MatIconModule, MatTooltipModule, MatDividerModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductoComponent } from 'src/app/componentes/producto/producto.component';
import { TextMaskModule } from 'angular2-text-mask';
import { ProductoService } from 'src/app/servicios/producto.service';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { RubroService } from 'src/app/servicios/rubro.service';
import { UnidadMedidaService } from 'src/app/servicios/unidad-medida.service';
import { MarcaProductoService } from 'src/app/servicios/marca-producto.service';
import { RubroProductoService } from 'src/app/servicios/rubro-producto.service';
import { InsumoProducto } from 'src/app/modelos/insumoProducto';

@NgModule({
  declarations: [
    ProductoComponent,
  ],
  imports: [
    CommonModule,
    ProductoRoutingModule,
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
    TextMaskModule,
    MatIconModule,
    MatTooltipModule,
    MatDividerModule
  ],
  providers: [
    ProductoService,
    InsumoProducto,
    SubopcionPestaniaService,
    RubroService,
    UnidadMedidaService,
    MarcaProductoService,
    RubroProductoService
  ]
})
export class ProductoModule { }
