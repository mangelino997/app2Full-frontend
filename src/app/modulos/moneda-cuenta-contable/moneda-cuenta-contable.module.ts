import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MonedaCuentaContableRoutingModule } from './moneda-cuenta-contable-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MonedaCuentaContableComponent } from 'src/app/componentes/moneda-cuenta-contable/moneda-cuenta-contable.component';
import { MonedaCuentaContableService } from 'src/app/servicios/moneda-cuenta-contable.service';
import { MonedaCuentaContable } from 'src/app/modelos/moneda-cuenta-contable';

@NgModule({
  declarations: [
    MonedaCuentaContableComponent,
  ],
  imports: [
    CommonModule,
    MonedaCuentaContableRoutingModule,
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
    MonedaCuentaContableService,
    MonedaCuentaContable
  ]
})
export class MonedaCuentaContableModule { }
