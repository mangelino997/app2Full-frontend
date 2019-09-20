import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CondicionCompraRoutingModule } from './condicion-compra-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatButtonModule, MatIconModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CondicionCompraComponent } from 'src/app/componentes/condicion-compra/condicion-compra.component';
import { TextMaskModule } from 'angular2-text-mask';
import { CondicionCompraService } from 'src/app/servicios/condicion-compra.service';
import { CondicionCompra } from 'src/app/modelos/condicion-compra';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';

@NgModule({
  declarations: [
    CondicionCompraComponent,
  ],
  imports: [
    CommonModule,
    CondicionCompraRoutingModule,
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
    MatIconModule
  ],
  providers: [
    CondicionCompraService,
    CondicionCompra,
    SubopcionPestaniaService
  ]
})
export class CondicionCompraModule { }
