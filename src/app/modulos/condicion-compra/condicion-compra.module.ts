import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CondicionCompraRoutingModule } from './condicion-compra-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CondicionCompraComponent } from 'src/app/componentes/condicion-compra/condicion-compra.component';
import { TextMaskModule } from 'angular2-text-mask';
import { CondicionCompraService } from 'src/app/servicios/condicion-compra.service';
import { CondicionCompra } from 'src/app/modelos/condicion-compra';

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
    TextMaskModule
  ],
  providers: [
    CondicionCompraService,
    CondicionCompra
  ]
})
export class CondicionCompraModule { }
