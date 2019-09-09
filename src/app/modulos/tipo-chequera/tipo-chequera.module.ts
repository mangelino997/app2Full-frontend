import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TipoChequeraRoutingModule } from './tipo-chequera-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TipoChequeraComponent } from 'src/app/componentes/tipo-chequera/tipo-chequera.component';
import { TipoChequeraService } from 'src/app/servicios/tipo-chequera.service';

@NgModule({
  declarations: [
    TipoChequeraComponent,
  ],
  imports: [
    CommonModule,
    TipoChequeraRoutingModule,
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
    TipoChequeraService
  ]
})
export class TipoChequeraModule { }
