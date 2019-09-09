import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MonedaRoutingModule } from './moneda-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MonedaComponent } from 'src/app/componentes/moneda/moneda.component';
import { MonedaService } from 'src/app/servicios/moneda.service';
import { Moneda } from 'src/app/modelos/moneda';

@NgModule({
  declarations: [
    MonedaComponent,
  ],
  imports: [
    CommonModule,
    MonedaRoutingModule,
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
    MonedaService,
    Moneda
  ]
})
export class MonedaModule { }
