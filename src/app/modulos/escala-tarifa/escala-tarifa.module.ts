import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EscalaTarifaRoutingModule } from './escala-tarifa-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EscalaTarifaComponent } from 'src/app/componentes/escala-tarifa/escala-tarifa.component';
import { EscalaTarifaService } from 'src/app/servicios/escala-tarifa.service';

@NgModule({
  declarations: [
    EscalaTarifaComponent,
  ],
  imports: [
    CommonModule,
    EscalaTarifaRoutingModule,
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
    EscalaTarifaService
  ]
})
export class EscalaTarifaModule { }
