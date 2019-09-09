import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CuentaBancariaDialogoRoutingModule } from './cuenta-bancaria-dialogo-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatDialogModule, MatIconModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CuentaBancariaDialogoComponent } from 'src/app/componentes/cuenta-bancaria-dialogo/cuenta-bancaria-dialogo.component';

@NgModule({
  declarations: [
    CuentaBancariaDialogoComponent,
  ],
  imports: [
    CommonModule,
    CuentaBancariaDialogoRoutingModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatProgressBarModule,
    MatDialogModule,
    MatIconModule
  ]
})
export class CuentaBancariaDialogoModule { }
