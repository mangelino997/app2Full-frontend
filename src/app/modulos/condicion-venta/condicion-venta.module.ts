import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CondicionVentaRoutingModule } from './condicion-venta-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CondicionVentaComponent } from 'src/app/componentes/condicion-venta/condicion-venta.component';
import { CondicionVentaService } from 'src/app/servicios/condicion-venta.service';
import { CondicionVenta } from 'src/app/modelos/condicion-venta';

@NgModule({
  declarations: [
    CondicionVentaComponent,
  ],
  imports: [
    CommonModule,
    CondicionVentaRoutingModule,
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
    CondicionVentaService,
    CondicionVenta
  ]
})
export class CondicionVentaModule { }
