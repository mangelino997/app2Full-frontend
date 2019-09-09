import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChequesRechazadosRoutingModule } from './cheques-rechazados-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChequesRechazadosComponent } from 'src/app/componentes/cheques-rechazados/cheques-rechazados.component';

@NgModule({
  declarations: [
    ChequesRechazadosComponent,
  ],
  imports: [
    CommonModule,
    ChequesRechazadosRoutingModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatProgressBarModule
  ]
})
export class ChequesRechazadosModule { }
