import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmitirFacturaRoutingModule } from './emitir-factura-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmitirFacturaComponent } from 'src/app/componentes/emitir-factura/emitir-factura.component';
import { TextMaskModule } from 'angular2-text-mask';
import { EmitirFactura } from 'src/app/modelos/emitirFactura';

@NgModule({
  declarations: [
    EmitirFacturaComponent,
  ],
  imports: [
    CommonModule,
    EmitirFacturaRoutingModule,
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
    EmitirFactura
  ]
})
export class EmitirFacturaModule { }
